'use strict'

const so = require('so')
const api = require('meinfernbus')
const uniq = require('lodash.uniq')
const pick = require('lodash.pick')
const fs = require('fs')
const path = require('path')

const tokenize = require('./tokenize')

// to get smaller JSONs
const CITY = 0
const STATION = 1

const prefix = (location) => {
	return (location.type === 'city' ? 'c' : 's') + location.id
}

const write = (name, data) =>
	new Promise((yay, nay) => {
		const dest = path.join(__dirname, name)
		fs.writeFile(dest, JSON.stringify(data), (err) => {
			if (err) nay(err)
			else yay()
		})
	})

so(function* () {
	const rawCities = yield api.locations.cities()
	const rawStations = yield api.locations.stations()

	console.info('Building a search index.')
	const byPrefix = {}
	const byToken = {}

	for (let c of rawCities) {
		const key = prefix(c)
		const tokens = tokenize(c.name)
		// todo: s.aliases
		if (c.aliases && c.aliases.length > 0) {
			console.error(`city ${c.id} has aliases, which are not supported`)
		}

		byPrefix[key] = [CITY, c.id, c.name, tokens.length, c.stations]
		for (let token of tokens) {
			if (!byToken[token]) byToken[token] = []
			byToken[token].push(key)
		}
	}

	for (let s of rawStations) {
		const key = prefix(s)
		const tokens = tokenize(s.name)
		// todo: s.aliases
		if (s.aliases && s.aliases.length > 0) {
			console.error(`station ${c.id} has aliases, which are not supported`)
		}

		byPrefix[key] = [STATION, s.id, s.name, tokens.length, s.city]
		for (let token of tokens) {
			if (!byToken[token]) byToken[token] = []
			byToken[token].push(key)
		}
	}

})()
.catch((err) => {
	console.error(err.stack || err.message)
	process.exit(1)
})
