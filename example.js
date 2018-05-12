'use strict'

const prompt = require('cli-autocomplete')

const autocomplete = require('.')

const suggest = (input) => {
	const results = autocomplete(input, 5)
	const choices = []

	for (let result of results) {
		choices.push({
			title: [
				result.name,
				'–',
				'score:', result.score.toFixed(3),
				'relevance:', result.relevance.toFixed(3)
			].join(' '),
			value: result.id
		})
	}

	return Promise.resolve(choices)
}

prompt('Type a station name!', suggest)
.once('abort', () => {
	process.exitCode = 1
})
.once('submit', (id) => {
	console.log('station ID:', id)
})
