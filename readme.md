# *search-flix-locations*

**Search for [Flix/Flixbus/Meinfernbus](https://flixbus.de/) regions & stations.**

[![asciicast](https://asciinema.org/a/83504.png)](https://asciinema.org/a/83504)

[![npm version](https://img.shields.io/npm/v/search-flix-locations.svg)](https://www.npmjs.com/package/search-flix-locations)
[![build status](https://img.shields.io/travis/derhuerst/search-flix-locations.svg)](https://travis-ci.org/derhuerst/search-flix-locations)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/search-flix-locations.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install search-flix-locations
```


## Usage

```js
autocomplete(query, limit = 6, fuzzy = false, completion = true)
```

```js
const pick = require('lodash.pick')
const search = require('search-flix-locations')

console.log(search('berlin', 5))
```

```js
[ {
    id: '88',
    name: 'Berlin',
    type: 'region',
    relevance: 3.455855112783178,
    score: 27.984681385568972,
    weight: 531
}, {
    id: '1224',
    name: 'Berlin Alexanderplatz',
    type: 'station',
    relevance: 1.727927556391589,
    score: 7.743542752920189,
    weight: 90
}, {
    id: '481',
    name: 'Berlin Südkreuz',
    type: 'station',
    relevance: 1.727927556391589,
    score: 7.445414138704126,
    weight: 80
}, {
    id: '471',
    name: 'Berlin SXF',
    type: 'station',
    relevance: 1.727927556391589,
    score: 7.121282437290776,
    weight: 70
}, {
    id: '2825',
    name: 'Berlin Zoo',
    type: 'station',
    relevance: 1.727927556391589,
    score: 5.369072671153364,
    weight: 30
} ]
```

If you set `fuzzy` to `true`, words with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) `<= 3` will be taken into account. This is a lot slower though.


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/search-flix-locations/issues).
