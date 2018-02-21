'use strict'

const create = require('synchronous-autocomplete')

const tokenize = require('./tokenize')

const tokens = require('./data/tokens.json')
const scores = require('./data/scores.json')
const weights = require('./data/weights.json')
const nrOfTokens = require('./data/nr-of-tokens.json')
const originalIds = require('./data/original-ids.json')
const names = require('./data/names.json')

const _autocomplete = create(tokens, scores, weights, nrOfTokens, originalIds, tokenize)

const autocomplete = (query, limit = 6, fuzzy = false, completion = true) => {
	const results = _autocomplete(query, limit, fuzzy, completion)
	for (let res of results) {
		res.type = res.id[0] === 'r' ? 'region' : 'station'
		res.id = res.id.slice(1)
		res.name = names[res[_autocomplete.internalId]]
	}
	return results
}

module.exports = autocomplete
