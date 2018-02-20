# *search-meinfernbus-locations*

**Search for [Flixbus/Meinfernbus](https://flixbus.de/) regions & stations.**

[![asciicast](https://asciinema.org/a/83504.png)](https://asciinema.org/a/83504)

[![npm version](https://img.shields.io/npm/v/search-meinfernbus-locations.svg)](https://www.npmjs.com/package/search-meinfernbus-locations)
[![build status](https://img.shields.io/travis/derhuerst/search-meinfernbus-locations.svg)](https://travis-ci.org/derhuerst/search-meinfernbus-locations)
[![dependency status](https://img.shields.io/david/derhuerst/search-meinfernbus-locations.svg)](https://david-dm.org/derhuerst/search-meinfernbus-locations)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/search-meinfernbus-locations.svg)](https://david-dm.org/derhuerst/search-meinfernbus-locations#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/search-meinfernbus-locations.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install search-meinfernbus-locations
```


## Usage

```js
autocomplete(query, limit = 6, fuzzy = false, completion = true)
```

```js
const pick = require('lodash.pick')
const search = require('search-meinfernbus-locations')

const results = search('berlin').map((r) => {
	return pick(r, ['id', 'type', 'name', 'relevance'])
})

console.log(results)
```

```js
[
    {
        id: "88",
        type: "region",
        name: "Berlin",
        relevance: 3.706239742783178
    },
    {
        id: "1224",
        type: "station",
        name: "Berlin Alexanderplatz",
        relevance: 1.853119871391589
    },
    {
        id: "481",
        type: "station",
        name: "Berlin Südkreuz",
        relevance: 1.853119871391589
    },
    {
        id: "471",
        type: "station",
        name: "Berlin SXF",
        relevance: 1.853119871391589
    },
    {
        id: "2825",
        type: "station",
        name: "Berlin Zoo",
        relevance: 1.853119871391589
    },
    {
        id: "12468",
        type: "station",
        name: "Berlin TXL, E",
        relevance: 1.2354132475943926
    }
]
```

If you set `fuzzy` to `true`, words with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) `<= 3` will be taken into account. This is a lot slower though.


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/search-meinfernbus-locations/issues).
