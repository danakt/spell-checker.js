const fs    = require('fs')
const path  = require('path')
const iconv = require('iconv-lite')

// Default dictionaries --------------------------------------------------------
var dictionaries = {
    ru: {
        src: './dictionaries/ru/russian.txt',
        charset: 'windows-1251'
    },
    ru_surnames: {
        src: './dictionaries/ru/russian_surnames.txt',
        charset: 'windows-1251'
    },
    en: {
        src: './dictionaries/en/english.txt',
        charset: 'windows-1252'
    },
}

// Reading of dictionary -------------------------------------------------------
module.exports = ({ input, async, charset, words }) => {
    if(dictionaries[input] != null) {
        charset = dictionaries[input].charset
        input   = dictionaries[input].src
    }

    // Log error if file is not exists
    if(!fs.existsSync(input)) {
        console.error(`ERROR! File "${input}" does not exist`)
        return { words, len: 0 }
    }

    // Synchronious loading
    if(!async) {
        let buff = fs.readFileSync(path.resolve(input))
        let text = iconv.decode(buff, charset)
        return getWordsList(text, words)
    }

    // Asynchronious loading
    if(async) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(input), function(err, buff) {
                if(err) {
                    reject(err)
                    return
                }

                let text = iconv.decode(buff, charset)
                resolve(getWordsList(text, words))
            })
        })
    }
}

// Getting words list ----------------------------------------------------------
function getWordsList(text, words) {
    let nodeVersion = process.version.split(/[^\d]/).filter(i => i != '')[0]
    let getWordsListFunc = require('./read-dictionary/' + nodeVersion)

    return getWordsListFunc(text, words)
}
