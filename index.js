'use strict'

const hifo = require('hifo')

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

const enrichTokenWithStations = (token) => {
	token.stations = []
	for (let id of byToken[token.name])
		token.stations.push(byId[id])
	return token
}

const enrichFragmentWithTokens = (fragment) => ({
	name: fragment,
	tokens: findTokensForFragment(fragment).map(enrichTokenWithStations)
})



const autocomplete = (query, limit) => {
	if (query.trim() === '') return []
	const results = hifo(hifo.highest('relevance'), limit || 5)

	const fragments = tokenize(query).map(enrichFragmentWithTokens)

	return fragments
}

module.exports = autocomplete
