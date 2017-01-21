const fs    = require('fs')
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
module.exports = (input, charset) => {
    if(typeof input === 'object') {
        var {input, charset, time} = input
    }

    if(time == null) time = true
    if(charset == null) charset = 'utf8'

    let filenameArr = input.split(/[\\\/]/g)
    let filename    = filenameArr[filenameArr.length - 1]


    if(dictionaries[input] != null) {
        charset = dictionaries[input].charset
        input   = dictionaries[input].src
    }

    if(!fs.existsSync(input)) {
        console.error('ERROR! File does not exist')
        return
    }

    let file  = fs.readFileSync(input)
    let text  = iconv.decode(file, charset)
    let list  = text.split('\n')
    let words = new Set()

    for (let i = 0; i < list.length; i++) {
        words.add(list[i])
    }

    return words
}
