'use strict'

const path = require('path')
const fs = require('fs')
const buildIndexes = require('synchronous-autocomplete/build')
const api = require('meinfernbus')

const tokenize = require('./tokenize')

const REGION = 'region'
const STATION = 'station'

// todo: use require('util').promisify
const writeFile = (file, data) => new Promise((resolve, reject) => {
	const dest = path.join(__dirname, 'data', file)
	fs.writeFile(dest, JSON.stringify(data), (err) => {
		if (err) reject(err)
		else resolve()
	})
})

;(async () => {
	console.info('Fetching data from their API.')
	const rawRegions = await api.regions()
	const rawStations = await api.stations()

	console.info('Computing a search index.')
	// todo: store full data, e.g. name, regions
	// todo: map IDs to get smaller data
	const items = []
	const regions = Object.create(null) // by ID

	for (let r of rawRegions) {
		if (r.aliases && r.aliases.length > 0) {
			// todo
			console.error(`region ${r.id} has aliases, which are not supported`)
		}
		regions[r.id] = {
			id: 'r' + r.id,
			name: r.name,
			weight: 0 // will be accumulated to later
		}
	}

	for (let s of rawStations) {
		if (s.aliases && s.aliases.length > 0) {
			// todo
			console.error(`station ${s.id} has aliases, which are not supported`)
		}

		const weight = s.importance || 1
		for (let r of s.regions) {
			const region = regions[r]
			if (!region) {
				console.error(`region ${r} of station ${s.id} does not exist.`)
				continue
			}
			region.weight += weight
		}

		items.push({
			id: 's' + s.id,
			name: s.name,
			weight,
			regions: s.regions
		})
	}

	for (let id in regions) items.push(regions[id])

	const {tokens, scores, weights, nrOfTokens, originalIds} = buildIndexes(tokenize, items)

	console.info('Writing the index to disk.')
	await writeFile('tokens.json', tokens)
	await writeFile('scores.json', scores)
	await writeFile('weights.json', weights)
	await writeFile('nr-of-tokens.json', nrOfTokens)
	await writeFile('original-ids.json', originalIds)
})()
.catch((err) => {
	console.error(err)
	process.exitCode = 1
})
