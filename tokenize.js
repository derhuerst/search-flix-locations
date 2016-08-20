'use strict'

const normalize = require('normalize-for-search')

const delim = /[\s\/\(\)\-,\.\+]+/

// todo: see derhuerst/vbb-tokenize-station
const tokenize = (name) =>
	normalize(name)
	.split(delim)
	.map((part) => part.trim())
	.filter((part) => part.length > 0)

module.exports = tokenize
