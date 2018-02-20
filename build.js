'use strict'

const so = require('so')
const api = require('meinfernbus')
const fs = require('fs')
const path = require('path')

const tokenize = require('./tokenize')

// to get smaller JSONs
const REGION = 0
const STATION = 1

const write = (name, data) =>
	new Promise((yay, nay) => {
		const dest = path.join(__dirname, name)
		fs.writeFile(dest, JSON.stringify(data), (err) => {
			if (err) nay(err)
			else yay()
		})
	})

const read = (name) => new Promise((yay, nay) => {
	const src = path.join(__dirname, name)
	fs.readFile(src, {encoding: 'utf8'}, (err, data) => {
		if (err) return nay(err)
		try {
			yay(JSON.parse(data))
		} catch (err) {
			nay(err)
		}
	})
})

so(function* () {
	const rawRegions = yield api.regions()
	const rawStations = yield api.stations()

	console.info('Building a search index.')
	const locations = {} // by prefixed ID
	const byToken = {}

	for (let r of rawRegions) {
		const key = 'r' + r.id
		const tokens = tokenize(r.name)
		// todo: s.aliases
		if (r.aliases && r.aliases.length > 0) {
			console.error(`region ${r.id} has aliases, which are not supported`)
		}

		locations[key] = [
			REGION, r.id, r.name, tokens.length, r.stations, 0 // importance acc
		]
		for (let token of tokens) {
			if (!byToken[token]) byToken[token] = []
			byToken[token].push(key)
		}
	}

	for (let s of rawStations) {
		const key = 's' + s.id
		const tokens = tokenize(s.name)
		// todo: s.aliases
		if (s.aliases && s.aliases.length > 0) {
			console.error(`station ${s.id} has aliases, which are not supported`)
		}

		locations[key] = [
			STATION, s.id, s.name, tokens.length, s.regions, s.importance || 1
		]
		for (let token of tokens) {
			if (!byToken[token]) byToken[token] = []
			byToken[token].push(key)
		}
	}

	console.info('Computing region weights.')

	for (let s of rawStations) {
		for(let r of s.regions){
			const region = locations['r'+r]
			if (!region) {
				console.error(`station ${s.id} has an invalid region ${r}`)
				continue
			}
			region[5] += Math.max(s.importance, 3)
		}
	}

	console.info('Computing token scores.')
	const scores = {}
	const nrOfAllLocations = Object.keys(locations).length

	for (let token in byToken) {
		const nrOfLocations = byToken[token].length
		scores[token] = nrOfLocations / nrOfAllLocations
	}

	let max = 0
	for (let token in scores) {
		max = Math.max(scores[token], max)
	}

	for (let token in scores) {
		let score = (max - scores[token]) / max // revert, clamp to [0, 1]
		score = Math.pow(score, 5) // stretch distribution
		scores[token] = parseFloat(score.toFixed(5))
	}

	console.info('Writing index to file.')

	write('data/locations.json', locations)
	write('data/tokens.json', byToken)
	write('data/scores.json', scores)

})()
.catch((err) => {
	console.error(err.stack || err.message)
	process.exit(1)
})
