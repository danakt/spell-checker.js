const iconv    = require('iconv-lite')
const readDict = require('./read-dictionary')

// Main object with words
var WORDS = new Set()
// Dictionary load flag
var dictionaryIsLoaded = false

// Dictionary input ------------------------------------------------------------
function load(input, charset, time) {
    time && console.time(`Loaded dictionaries: «${filename}»`)

    WORDS = readDict(input, charset)
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
    var esymb = '-/\''

    for (let i = 0; i < esymb.length; i++) {
        if(recblock !== true && word.indexOf(esymb[i]) > -1) {
            return word.split(esymb[i]).map((item, i) => {
                return i == 0
                    ? checkWord(item, true)
                    : checkWord(item, true) || checkWord(esymb[i] + item, true)
            })
        }
    }
}

// Export ----------------------------------------------------------------------
if(typeof module !== 'undefined' && 'exports' in module) {
    module.exports = {
        check: check,
        load:  load,
        clear: clear
    }
}
