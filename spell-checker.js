'use strict'
const fs    = require('fs')
const iconv = require('iconv-lite')

// Main object with words
var WORDS = new Set()

var dictionaryIsLoaded = false

// Default dictionaries
var dictionaries = {
    ru: {
        src: __dirname + '/dictionaries/ru/russian.txt',
        charset: 'windows-1251'
    },
    ru_surnames: {
        src: __dirname + '/dictionaries/ru/russian_surnames.txt',
        charset: 'windows-1251'
    },
    en: {
        src: __dirname + '/dictionaries/en/english.txt',
        charset: 'windows-1252'
    },
}

// Dictionary input ------------------------------------------------------------
function load(input, charset, time) {
    if(typeof input === 'object') {
        var {input, charset, time} = input
    }

    if(time == null) time = true

    var filenameArr = input.split(/[\\\/]/g)
    var filename    = filenameArr[filenameArr.length - 1]

    time && console.time(`Loaded dictionaries: «${filename}»`)

    if(charset == null)
        charset = 'utf8'

    if(dictionaries[input] != null) {
        charset = dictionaries[input].charset
        input   = dictionaries[input].src
    }

    if(!fs.existsSync(input)) {
        console.error('ERROR! File does not exist')
        return
    }

    var file   = fs.readFileSync(input)
    var buffer = Buffer.from(file)
    var list   = iconv.decode(buffer, charset).split('\n')

    for (var i = 0; i < list.length; i++) {
        let item = list[i].trim()

        if(item.trim() !== '' && item[0] !== '#') {
            WORDS.add(item)
        }
    }

    dictionaryIsLoaded = true

    time && console.timeEnd(`Loaded dictionaries: «${filename}»`)
}

// Clear dictionaries ----------------------------------------------------------
function clear() {
    WORDS.clear()
    dictionaryIsLoaded = false
}

// Text spell checking ---------------------------------------------------------
function check(text) {
    if(!dictionaryIsLoaded) {
        console.error('ERROR! Dictionaries are not loaded')
        return
    }

    var textArr = text
        .replace(/[^А-яA-z0-9'\- ]/g, ' ')
        .split(' ')
        .filter(item => item)

    var outObj = {}

    for (var i = 0; i < textArr.length; i++) {
        var checked = checkWord(textArr[i])
        var checkedList = Array.isArray(checked) ? checked : [checked]

        for (var j = 0; j < checkedList.length; j++) {
            if(checkedList[j] == null) {
                outObj[textArr[i]] = true
            }
        }
    }

    return Object.keys(outObj)
}

// Word spell checking ---------------------------------------------------------
// true, null, или массив
var as = 0
function checkWord(word, recblock) {
    // Just go away, if the word is not literal
    if(word == null || word === '' || !isNaN(+ word))
        return null

    // If the word exists, returns true
    if(WORDS.has(word))
        return true

    // Try to remove the case
    if(WORDS.has(word.toLowerCase()))
        return true

    // Check for the presence of the add. chars
    var esymb = '-/\''

    for (var i = 0; i < esymb.length; i++) {
        if(recblock !== true && word.indexOf(esymb[i]) > -1) {
            return word.split(esymb[i]).map((item, i) => {
                return i == 0
                    ? checkWord(item, true)
                    : checkWord(item, true) || checkWord(esymb[i] + item, true)
            })
        }
    }

    return null
}
// -----------------------------------------------------------------------------
var spellcheck   = {
    check: check,
    load: load,
    clear: clear
}

if(typeof module !== 'undefined' && module.exports) {
    module.exports = spellcheck
}
