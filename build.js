'use strict'

const so = require('so')
const api = require('meinfernbus')
const fs = require('fs')
const path = require('path')

const tokenize = require('./tokenize')

// to get smaller JSONs
const CITY = 0
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
	// const rawCities = yield api.locations.cities()
	// yield write('raw-cities.json', rawCities)
	const rawCities = yield read('raw-cities.json')
	// const rawStations = yield api.locations.stations()
	// yield write('raw-stations.json', rawStations)
	const rawStations = yield read('raw-stations.json')
	// return

	console.info('Building a search index.')
	const locations = {} // by prefixed ID
	const byToken = {}

	for (let c of rawCities) {
		const key = 'c' + c.id
		const tokens = tokenize(c.name)
		// todo: s.aliases
		if (c.aliases && c.aliases.length > 0) {
			console.error(`city ${c.id} has aliases, which are not supported`)
		}

		locations[key] = [
			CITY, c.id, c.name, tokens.length, c.stations, 0 // importance acc
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
			console.error(`station ${c.id} has aliases, which are not supported`)
		}

		locations[key] = [
			STATION, s.id, s.name, tokens.length, s.city, s.importance || 1
		]
		for (let token of tokens) {
			if (!byToken[token]) byToken[token] = []
			byToken[token].push(key)
		}
	}

	console.info('Computing city weights.')

	for (let s of rawStations) {
		const city = locations['c' + s.city]
		if (!city) {
			console.error(`station ${s.id} has an invalid city ${s.city}`)
			continue
		}
		city[5] += Math.max(s.importance, 3)
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

	write('locations.json', locations)
	write('tokens.json', byToken)
	write('scores.json', scores)

})()
.catch((err) => {
	console.error(err.stack || err.message)
	process.exit(1)
})
