'use strict'

const hifo = require('hifo')
const maxBy = require('lodash.maxby')
const leven = require('leven')

const tokenize = require('./tokenize')

let rawLocations = require('./data/locations.json')
const byToken = require('./data/tokens.json')
const scores = require('./data/scores.json')

const locations = {}
for (let key in rawLocations) {
	const l = rawLocations[key]

	// todo: weight
	const r = {
		type: l[0] === 1 ? 'station' : 'city',
		id: l[1],
		name: l[2],
		tokens: l[3],
		weight: l[5]
	}
	if (r.type === 'city') r.stations = l[4]
	else if (r.type === 'station') r.city = l[4]

	locations[key] = r
}
rawLocations = null // garbage-collect

// this has been copied and adapted from derhuerst/vbb-stations-autocomplete
// todo: move it into a separate module

const tokensByFragment = (fragment, completion, fuzzy) => {
	const results = {}
	const l = fragment.length

	if (byToken[fragment]) {
		const relevance = 1 + scores[fragment] + Math.sqrt(l)

		for (let id of byToken[fragment]) {
			if (!results[id] || !results[id] < relevance) {
				results[id] = relevance
			}
		}
	}

	if (completion || fuzzy) {
		for (let t in byToken) {
			if (fragment === t) continue // has been dealt with above

			let relevance
			let distance

			// add-one smoothing
			if (completion && t.length > l && fragment === t.slice(0, l)) {
				relevance = 1 + scores[t] + l / t.length
			} else if (fuzzy && (distance = leven(fragment, t)) <= 3) {
				relevance = (1 + scores[t]) / (distance + 1)
			} else continue

			for (let id of byToken[t]) {
				if (!results[id] || !results[id] < relevance) {
					results[id] = relevance
				}
			}
		}
	}

	return results
}

const autocomplete = (query, limit = 6, fuzzy = false, completion = true) => {
	if (query === '') return []
	const relevant = hifo(hifo.highest('score'), limit || 6)

	const data = {}
	for (let fragment of tokenize(query)) {
		data[fragment] = tokensByFragment(fragment, completion, fuzzy)
	}

	const totalRelevance = (id) => {
		let r = 1 / locations[id].tokens
		for (let fragment in data) {
			if (!data[fragment][id]) return false
			r *= data[fragment][id]
		}
		return r
	}

	const results = {}
	for (let fragment in data) {
		for (let id in data[fragment]) {
			const relevance = totalRelevance(id)
			if (relevance === false) continue

			const station = locations[id]
			const score = relevance * Math.pow(station.weight, 1/3)

			if (!results[id] || results[id].score < score) {
				results[id] = {id, relevance, score}
			}
		}
	}

	for (let id in results) relevant.add(results[id])
	return relevant.data.map((r) => {
		return Object.assign({
			relevance: r.relevance, score: r.score
		}, locations[r.id])
	})
}

module.exports = autocomplete
