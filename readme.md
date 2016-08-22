# *search-meinfernbus-locations*

**Search for [Flixbus MeinFernbus](https://meinfernbus.de/) cities & stations.**

[![asciicast](https://asciinema.org/a/83504.png)](https://asciinema.org/a/83504)

[![npm version](https://img.shields.io/npm/v/search-meinfernbus-locations.svg)](https://www.npmjs.com/package/search-meinfernbus-locations)
[![build status](https://img.shields.io/travis/derhuerst/search-meinfernbus-locations.svg)](https://travis-ci.org/derhuerst/search-meinfernbus-locations)
[![dependency status](https://img.shields.io/david/derhuerst/search-meinfernbus-locations.svg)](https://david-dm.org/derhuerst/search-meinfernbus-locations)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/search-meinfernbus-locations.svg)](https://david-dm.org/derhuerst/search-meinfernbus-locations#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/search-meinfernbus-locations.svg)


## Installing

```shell
npm install search-meinfernbus-locations
```


## Usage

```js
const pick = require('lodash.pick')
const search = require('./index')

const results = search('berlin')
console.log(results.map((r) => pick(r, ['id', 'type', 'name', 'relevance'])))
```

```js
[ {
	id: 88, type: 'city',
	name: 'Berlin', relevance: 3.449489742783178
}, {
	id: 611, type: 'station',
	name: 'Berlin TXL', relevance: 2.949489742783178
}, {
	id: 1224, type: 'station',
	name: 'Berlin Alexanderplatz', relevance: 2.949489742783178
}, {
	id: 481, type: 'station',
	name: 'Berlin Südkreuz', relevance: 2.949489742783178
}, {
	id: 2825, type: 'station',
	name: 'Berlin Zoo', relevance: 2.949489742783178
}, {
	id: 471, type: 'station',
	name: 'Berlin SXF', relevance: 2.949489742783178
}, {
	id: 3288, type: 'station',
	name: 'Berlin Alt-Tegel', relevance: 2.7828230761165114
}, {
	id: 1, type: 'station',
	name: 'Berlin central bus station', relevance: 2.699489742783178
} ]
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/search-meinfernbus-locations/issues).
