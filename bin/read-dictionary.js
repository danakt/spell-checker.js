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
module.exports = (input, charset, prevlist) => {
    if(dictionaries[input] != null) {
        charset = dictionaries[input].charset
        input   = dictionaries[input].src
    }

    // For addng to prev dictionary
    let words = prevlist

    // Log error if file is not exists
    if(!fs.existsSync(input)) {
        console.error(`ERROR! File "${input}" does not exist`)
        return { words, len: 0 }
    }

    // Reading and convert file
    let buff = fs.readFileSync(path.resolve(input))
    let text = iconv.decode(buff, charset)

    let list  = text.split('\n')
    let len   = list.length
    // Remove last item if is empty
    if(list[len - 1] === '') {
        len--
    }

    // Add to collection
    let i = 0
    while (i < len) {
        words.add(list[i++])
    }

    // Remove empty element
    words.delete('')

    return { words, size: len }
}
