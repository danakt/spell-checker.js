# Spell-checker.js
Simple expandable tool for spell checking  

[![npm](https://img.shields.io/npm/v/spell-checker-js.svg?style=flat-square)](https://www.npmjs.com/package/spell-checker-js)
[![Travis branch](https://img.shields.io/travis/danakt/spell-checker.js/master.svg?style=flat-square)](https://travis-ci.org/danakt/spell-checker.js)

## Supported languages
* English
* Russian

## Quickstart
**Install:**  
`npm i spell-checker`

**Code**
```js
const spell = require('spell-checker-js');

// Load dictionary
spell.load('en');

// Checking text
spell.check('Some text to check, blahblahblah, olololo')
// -> ['blahblahblah', 'olololo']
```

## Methods
#### `spell.load(dic)` — load dictionary file
**WARNING:** Too large files can increase speed of the script initialization  

**Examples:**
```js
// load default dictionary:
spell.load('ru');

//load custom dictionary:
spell.load('./my_custom_dictionary.txt');

// laod custom dictionary with charset:
spell.load({input: './my_custom_dictionary.txt', charset: 'windows-1251'})

// load default dictionary with disable time logs
spell.load({input: 'en', time: false})
```

**List of default dictionaries:**
* `en` — list of English words
* `ru` — list of Russian words
* `ru_surnames` — list of Russian surnames

You can help by adding other languages or expand existing dictionaries

#### `spell.check(string)` — spell checking of text
**Returns:** array of wrong words  
**Example:**
```js
spell.load('en');

spell.check('Some text to check, blahblahblah, olololo')
// -> ['blahblahblah', 'olololo']
```

#### `spell.clear()` — clear all loaded dictionaries
**Example:**
```js
spell.load('en');

spell.clear();
spell.check('something');
// -> ERROR! Dictionaries are not loaded
```
