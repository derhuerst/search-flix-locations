'use strict'

const pick = require('lodash.pick')
const search = require('.')

const results = search('berlin').map((r) => {
	return pick(r, ['id', 'type', 'name', 'relevance'])
})

console.log(results)
