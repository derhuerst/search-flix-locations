#!/usr/bin/env node
'use strict'

const test = require('tape')
const isRoughlyEqual = require('is-roughly-equal')

const autocomplete = require('./index')

test('works with berlin', (t) => {
	t.plan(2 + 7 * 3 + 4 * 3)
	const results = autocomplete('berlin', 3)

	t.ok(Array.isArray(results))
	t.equal(results.length, 3)

	for (let result of results) {
		t.equal(typeof result, 'object')
		t.equal(typeof result.type, 'string')
		t.equal(typeof result.id, 'string')
		t.equal(typeof result.name, 'string')
		t.equal(typeof result.relevance, 'number')
		t.equal(typeof result.score, 'number')
		t.equal(typeof result.weight, 'number')
	}

	t.equal(results[0].id, '88')
	t.equal(results[0].type, 'region')
	t.equal(results[0].name, 'Berlin')
	t.ok(isRoughlyEqual(.1, results[0].relevance, 3.7))

	t.equal(results[1].id, '1224')
	t.equal(results[1].type, 'station')
	t.equal(results[1].name, 'Berlin Alexanderplatz')
	t.ok(isRoughlyEqual(.1, results[1].relevance, 1.85))

	t.equal(results[2].id, '481')
	t.equal(results[2].type, 'station')
	t.equal(results[2].name, 'Berlin Südkreuz')
	t.ok(isRoughlyEqual(.1, results[2].relevance, 1.85))
})

test('works with berlin südkreuz', (t) => {
	t.plan(4)
	const result = autocomplete('berlin südkreuz', 1)[0]
	t.equal(result.id, '481')
	t.equal(result.type, 'station')
	t.equal(result.name, 'Berlin Südkreuz')
	t.ok(isRoughlyEqual(.1, result.relevance, 8.73))
})
