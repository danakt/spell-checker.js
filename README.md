# Spell-checker.js
Simple expandable tool for spell checking  

[![Travis branch](https://img.shields.io/travis/danakt/spell-checker-js/master.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/v/spell-checker-js.svg?style=flat-square)]()


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
**WARNING:** Too large files can increase speed of script initialization  

**Examples:**
```js
// load default dictionary:
spell.load('en');
//laod cutom dictionary:
spell.load('./my_custom_dictionary.txt');
// laod cutom dictionary with charset:
spell.load({input: './my_custom_dictionary.txt', charset: 'windows-1251'})
// load default dictionary with disable time logs
spell.load({input: 'ru', time: false})
```

**List of default dictionaries:**
* `en` — list of English words
* `ru` — list of Rissian words
* `ru_surnames` — list of Russian surnames

You can help by adding other languages or expand existing dictionaries

#### `spell.check(sting)` — spell checking of text
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
