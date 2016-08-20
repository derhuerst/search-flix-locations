'use strict'

const so = require('so')
const api = require('meinfernbus')
const uniq = require('lodash.uniq')
const pick = require('lodash.pick')
const normalize = require('normalize-for-search')
const fs = require('fs')
const path = require('path')



// todo: see derhuerst/vbb-tokenize-station
const tokenize = (name) => normalize(name).replace(/-/g, ' ').split(' ')

const tokens = (names) =>
	uniq(names.reduce((all, name) => all.concat(tokenize(name)), []))

so(function* () {



	const cities = (yield api.locations.cities())
		.map((city) => ({
			type: 'city',
			id: city.id, name: city.name,
			latitude: city.coordinates.latitude,
			longitude: city.coordinates.longitude,
			tokens: tokens((city.aliases || []).concat(city.name))
		}))
	console.info(cities.length + ' cities')

	const stations = (yield api.locations.stations())
		.map((station) => Object.assign(
			pick(station, ['id', 'name', 'street', 'zip', 'city']),
			{
				type: 'station',
				country: station.country.code,
				latitude: station.coordinates.latitude,
				longitude: station.coordinates.longitude,
				tokens: tokens((station.aliases || []).concat(station.name))
			}))
	console.info(stations.length + ' stations')

	const data = cities.concat(stations)
		.reduce((byToken = {}, location) => {
			for (let token of location.tokens) {
				if (!(token in byToken)) byToken[token] = []
				byToken[token].push(location)
			}
			return byToken
		})

	yield new Promise((yay, nay) => fs.writeFile(
		path.join(__dirname, 'data.json'),
		JSON.stringify(data),
		(err) => {if (err) nay(err); else yay()}
	))



})()
.catch((err) => {
	console.error(err.stack || err.message)
	process.exit(1)
})
