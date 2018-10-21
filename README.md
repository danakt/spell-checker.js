# Spell-checker.js
Simple expandable tool for spell checking  

[![npm](https://img.shields.io/npm/v/spell-checker-js.svg?style=flat-square)](https://www.npmjs.com/package/spell-checker-js)
[![Travis branch](https://img.shields.io/travis/danakt/spell-checker.js/master.svg?style=flat-square)](https://travis-ci.org/danakt/spell-checker.js)

Readme: **`English`** [`Русский`](README.RU.md)

## Supported languages
* English
* Russian

## Quickstart
**Install:**  
`npm i spell-checker-js`

**Code**
```js
const spell = require('spell-checker-js')

// Load dictionary
spell.load('en')

// Checking text
const check = spell.check('Some text to check, blahblahblah, olololo')

console.log(check)
// -> ['blahblahblah', 'olololo']
```

## Methods & properties
### `spell.load(dictionary)` or `spell.load(options)` — load dictionary file

**Examples:**
```js
// ways for load default dictionary:
spell.load('ru')
spell.load({ input: 'ru' })

// load custom dictionary with utf-8:
spell.load('./my_custom_dictionary.txt')

// laod custom dictionary with charset:
spell.load({ input: './my_custom_dictionary.txt', charset: 'windows-1251' })

// Asynchronous load default dictionary:
spell.load({ input: 'en', async: true }).then(len => {
    console.log(len);
    // len — amount of added words to base
    spell.check('something')
})
```

**List of default dictionaries:**
* `en` — list of English words
* `ru` — list of Russian words
* `ru_surnames` — list of Russian surnames

You can help by adding other languages or expand existing dictionaries

### `spell.check(string)` — spell checking of text
**Returns:** array of wrong words  
**Example:**
```js
spell.load('en')

const check = spell.check('Some text to check, blahblahblah, olololo')

console.log(check)
// -> ['blahblahblah', 'olololo']
```

### `spell.clear()` — clear all loaded dictionaries
**Example:**
```js
spell.load('en')

spell.clear()
spell.check('something')

// -> ERROR! Dictionaries are not loaded
```

### `spell.size` — number of words in the dictionary are
**Example**
```js
spell.load('en')
spell.load('ru')

console.log(spell.size)
// -> 1956898
```

## License
MIT © 2016 Danakt Frost
