'use strict'

const so = require('so')
const api = require('meinfernbus')
const uniq = require('lodash.uniq')
const pick = require('lodash.pick')
const fs = require('fs')
const path = require('path')

const tokenize = require('./tokenize')



const computeTokens = (location) =>
	uniq((location.aliases || []).concat(location.name)
		.reduce((all, name) => all.concat(tokenize(name)), []))

const prefix = (location) =>
	(location.type === 'city' ? 'c' : 's') + location.id

const write = (name, data) => new Promise((yay, nay) =>
	fs.writeFile(
		path.join(__dirname, name),
		JSON.stringify(data),
		(err) => {if (err) nay(err); else yay()}
	))

so(function* () {



	const cities = (yield api.locations.cities())
		.map((city) => ({
			type: 'city',
			id: city.id, name: city.name,
			tokens: computeTokens(city).length
		}))
	console.info(cities.length + ' cities')

	const stations = (yield api.locations.stations())
		.map((station) => Object.assign(
			pick(station, ['id', 'name', 'street', 'zip', 'city']),
			{
				type: 'station',
				country: station.country.code,
				tokens: computeTokens(station).length
			}))
	console.info(stations.length + ' stations')



	const byId = cities.concat(stations)
		.reduce((foo, l) => {
			foo[prefix(l)] = l
			return foo
		}, {})

	const byToken = cities.concat(stations)
		.reduce((bar, l) => {
			const id = prefix(l)
			const tokens = computeTokens(l)
			for (let token of tokens) {
				if (!(token in bar)) bar[token] = []
				bar[token].push(id)
			}
			return bar
		}, {})



	yield write('by-id.json', byId)
	yield write('by-token.json', byToken)



})()
.catch((err) => {
	console.error(err.stack || err.message)
	process.exit(1)
})
