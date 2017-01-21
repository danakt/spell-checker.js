/**
 * Spell-checker.js
 * @desc Simple expandable tool for spell checking
 * @author Danakt Frost <mail@danakt.ru>
 *
 * @todo
 *   Make async load dictionaries
 *   Add support word prefixes (авто...)
 */

const iconv    = require('iconv-lite')
const XRegExp  = require('xregexp')
const readDict = require('./read-dictionary')

// Main object with words
var WORDS = new Set()
var SIZE  = 0

// Dictionary input ------------------------------------------------------------
function load(input, charset) {
    // Getting arguments
    if(input.constructor === Object) {
        var { input, charset } = input
    }

    // Read dictionary file
    let dict = readDict(input, charset || 'utf8', WORDS)
    WORDS = dict.words
    SIZE += dict.size
}

// Clear dictionaries ----------------------------------------------------------
function clear() {
    WORDS.clear()
    SIZE = 0
}

// Text spell checking ---------------------------------------------------------
function check(text) {
    if(SIZE === 0) {
        console.error('ERROR! Dictionaries are not loaded')
        return
    }

    let regex = new XRegExp('[^\\p{N}\\p{L}-_]', 'g')
    let textArr = text
        .replace(regex, ' ')
        .split(' ')
        .filter(item => item)

    let outObj = {}

    for (let i = 0; i < textArr.length; i++) {
        let checked = checkWord(textArr[i])
        let checkedList = Array.isArray(checked)
            ? checked
            : [checked]

        for (let j = 0; j < checkedList.length; j++) {
            if(checkedList[j] == null) {
                outObj[textArr[i]] = true
            }
        }
    }

    return Object.keys(outObj)
}

// Word spell checking ---------------------------------------------------------
function checkWord(word, recblock) {
    // Just go away, if the word is not literal
    if(word == null || word === '' || !isNaN(+ word))
        return

    // Way of reducing the load-time of dictionary
    // Post-escaping comments from files
    word = word.replace(/^#/, '');

    // If the word exists, returns true
    if(WORDS.has(word))
        return true

    // Try to remove the case
    if(WORDS.has(word.toLowerCase()))
        return true

    // Check for the presence of the add. chars
    let esymb = '-/\''

    for (let i = 0; i < esymb.length; i++) {
        if(recblock !== true && word.indexOf(esymb[i]) > -1) {
            return word
                .split(esymb[i])
                .map((item, i) => i == 0
                    ? checkWord(item, true)
                    : checkWord(item, true) || checkWord(esymb[i] + item, true)
                )
        }
    }
}

// Export ----------------------------------------------------------------------
if(typeof module !== 'undefined' && 'exports' in module) {
    module.exports = {
        check: check,
        load:  load,
        clear: clear,
        get size() {
            return SIZE
        },
        get words() {
            return WORDS
        }
    }
}
