#!/usr/bin/env node
'use strict'

const test = require('tape')
const isRoughlyEqual = require('is-roughly-equal')

const autocomplete = require('./index')



test('works with berlin', (t) => {
	t.plan(2 + 5 * 3 + 4 * 3)
	const results = autocomplete('berlin', 3)

	t.ok(Array.isArray(results))
	t.equal(results.length, 3)
	for (let result of results) {
		t.equal(typeof result, 'object')
		t.equal(typeof result.type, 'string')
		t.equal(typeof result.id, 'number')
		t.equal(typeof result.name, 'string')
		t.equal(typeof result.relevance, 'number')
	}

	t.equal(results[0].id, 88)
	t.equal(results[0].type, 'city')
	t.equal(results[0].name, 'Berlin')
	t.ok(isRoughlyEqual(.01, results[0].relevance, 3.45))

	t.equal(results[1].id, 611)
	t.equal(results[1].type, 'station')
	t.equal(results[1].name, 'Berlin TXL')
	t.ok(isRoughlyEqual(.01, results[1].relevance, 2.95))

	t.equal(results[2].id, 1224)
	t.equal(results[2].type, 'station')
	t.equal(results[2].name, 'Berlin Alexanderplatz')
	t.ok(isRoughlyEqual(.01, results[2].relevance, 2.95))
})

test('works with berlin südkreuz', (t) => {
	t.plan(4)
	const result = autocomplete('berlin südkreuz', 1)[0]

	t.equal(result.id, 481)
	t.equal(result.type, 'station')
	t.equal(result.name, 'Berlin Südkreuz')
	t.ok(isRoughlyEqual(.01, result.relevance, 7.45))
})
