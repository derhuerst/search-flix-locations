'use strict'

const tokenize = require('./tokenize')

const byId = require('./by-id.json')
const byToken = require('./by-token.json')



const findTokensForFragment = (fragment) => {
	// exact match
	if (fragment in byToken) return [{
		name: fragment, relevance: Math.sqrt(fragment.length)
	}]

	const results = []
	for (let token in byToken) {
		// match begins with fragment
		if (fragment === token.slice(0, fragment.length)) results.push({
			name: token, relevance: fragment.length / token.length
		})
	}

	return results
}

const enrichFragmentWithTokens = (fragment) => ({
	name: fragment,
	tokens: findTokensForFragment(fragment)
})



const enrichFragmentWithStations = (fragment, i, fragments) => {
	fragment.stations = []
	for (let token of fragment.tokens) {
		for (let id of byToken[token.name]) {
			const station = Object.create(byId[id])
			station.relevance = token.relevance
				+ fragments.length / station.tokens
			fragment.stations.push(station)
		}
	}
	return fragment
}

const findStationsFromFragments = (results, fragment, i, fragments) => {
	for (let station1 of fragment.stations) {
		const match = fragments.every((fragment) =>
			fragment.stations.find((station2) => station2.id === station1.id))
		if (match) results.push(station1)
	}
	return results
}

const addUpRelevance = (results, station1, i, stations) => {
	const previous = results.find((station2) => station2.id === station1.id)
	if (previous) previous.relevance += station1.relevance
	else results.push(station1)
	return results
}

const sortByRelevance = (a, b) => b.relevance - a.relevance



const autocomplete = (query, limit) =>
	tokenize(query)
	.map(enrichFragmentWithTokens)
	.map(enrichFragmentWithStations)
	.reduce(findStationsFromFragments, [])
	.reduce(addUpRelevance, [])
	.sort(sortByRelevance)
	.slice(0, limit)

module.exports = autocomplete
