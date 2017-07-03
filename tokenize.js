'use strict'

const normalize = require('slug')

const delim = /[\s\/\(\)\-,\.\+]+/

// todo: see derhuerst/vbb-tokenize-station
const tokenize = (name) =>
	normalize(name)
	.toLowerCase()
	.split(delim)
	.map((part) => part.trim())
	.filter((part) => part.length > 0)

module.exports = tokenize
