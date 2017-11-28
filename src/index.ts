/**
 * Spell-checker.js
 * Simple expandable tool for spell checking
 * @author Danakt Frost <mail@danakt.ru>
 *
 * @todo Add support word prefixes (авто...)
 */
import * as fs      from 'fs'
import { resolve }  from 'path'
import * as iconv   from 'iconv-lite'
import * as XRegExp from 'xregexp'

/**
 * The result of file reading
 * @interface FileResult
 */
declare interface FileResult {
  words: Set<string>
  size:  number
}

class SpellChecker {
  /** Object for storing list and the number of words */
  private BUFFER = {
    WORDS: new Set(),
    SIZE:  0,
  }

  /** Default dictionaries */
  private dictionaries = {
    ru: {
      src: resolve(__dirname, '../dictionaries/ru/russian.txt'),
      charset: 'windows-1251'
    },
    ru_surnames: {
      src: resolve(__dirname, '../dictionaries/ru/russian_surnames.txt'),
      charset: 'windows-1251'
    },
    en: {
      src: resolve(__dirname, '../dictionaries/en/english.txt'),
      charset: 'windows-1252'
    },
  }

  /**
   * Load a library into buffer
   * @param  {string} inputOrProps  A string with a library name or a path
   *   to a file with a list of words
   * @param  {string} charsetOption Charset. Used only if the type of the
   *   first parameter is string
   * @return {Object}
   */
  public load(inputOrProps: { input: string, charset?: string, async: true }): Promise<number>
  public load(inputOrProps: string, charsetOption?: string): number
  public load(inputOrProps: { input: string, charset?: string, async?: false }): number
  public load(inputOrProps, charsetOption?) {
    const options = this.parseParams(inputOrProps, charsetOption)

    // Synchronous file loading
    if (!options.async) {
      const dictionary: FileResult = this.readDictionarySync(
        options.input,
        options.charset,
        this.BUFFER.WORDS
      )

      this.BUFFER.WORDS = dictionary.words
      this.BUFFER.SIZE += dictionary.size

      return dictionary.size
    } else {
      // Asynchronous file loading
      const dictPromise: Promise<FileResult> = this.readDictionaryAsync(
        options.input,
        options.charset || 'utf8',
        this.BUFFER.WORDS
      )

      return new Promise((resolve) => {
        dictPromise.then(resp => {
          this.BUFFER.WORDS = resp.words
          this.BUFFER.SIZE += resp.size

          resolve(resp.size)
        })
      })
    }
  }

  /** Clears buffer */
  public clear(): void {
    this.BUFFER.WORDS.clear()
    this.BUFFER.SIZE = 0
  }

  /**
   * Finds words with mistakes in the text
   * @param {string} text
   */
  public check(text: string) {
    if(this.BUFFER.SIZE === 0) {
      console.error('ERROR! Dictionaries are not loaded')
      return
    }

    const regex = XRegExp('[^\\p{N}\\p{L}-_]', 'g')
    const textArr = text
      .replace(regex, ' ')
      .split(' ')
      .filter(item => item)

    const outObj = {}

    for (let i = 0; i < textArr.length; i++) {
      const checked = this.checkWord(textArr[i])
      const checkedList = Array.isArray(checked)
        ? checked
        : [checked]

      for (let j = 0; j < checkedList.length; j++) {
        if (checkedList[j] == null) {
          outObj[textArr[i]] = true
        }
      }
    }

    return Object.keys(outObj)
  }

  /**
   * Gets a list of words from buffer
   * @return {Set}
   */
  public get words(): Set<string> {
    return this.BUFFER.WORDS
  }

  /**
   * Gets the number of words in the list
   * @return {number}
   */
  public get size(): number {
    return this.BUFFER.SIZE
  }

  /**
   * Parses ambiguity in parameters depending on their value, returns an
   * object with single-valued parameters
   * @private
   * @return {Object}
   */
  private parseParams(
    inputOrProps:   string | {
      input:  string,
      charset?: string,
      async?:   boolean,
    },
    charsetOption?: string,
  ): {
    input:   string
    charset: string
    async:   boolean
  } {
    // Getting arguments
    if (typeof inputOrProps !== 'string') {
      return {
        input:   inputOrProps.input,
        charset: inputOrProps.charset || 'utf8',
        async:   inputOrProps.async,
      }
    }

    return {
      input:   inputOrProps,
      charset: charsetOption || 'utf8',
      async:   false,
    }
  }

  /**
   * Word spell checking
   * @private
   */
  private checkWord(wordProp: string, recblock?: boolean) {
    // Just go away, if the word is not literal
    if (wordProp == null || wordProp === '' || !isNaN(Number(wordProp))) {
      return
    }

    // Way of reducing the load-time of dictionary
    // Post-escaping comments from files
    const word: string = wordProp.replace(/^#/, '')

    // If the word exists, returns true
    if (this.BUFFER.WORDS.has(word)) {
      return true
    }

    // Try to remove the case
    if (this.BUFFER.WORDS.has(word.toLowerCase())) {
      return true
    }

    // Check for the presence of the add. chars
    const esymb = '-/\''

    // Checking parts of words
    for (let i = 0; i < esymb.length; i++) {
      if (recblock || word.indexOf(esymb[i]) === -1) {
        continue
      }

      const retArray = word
        .split(esymb[i])
        .map((item: string, i: number) => {
          if (i === 0) {
            return this.checkWord(item, true)
          } else {
            const res = this.checkWord(item, true)
            return res || this.checkWord(esymb[i] + item, true)
          }
        })

      return retArray
    }
  }

  /**
   * Returns a list of words from the library
   * @private
   * @param  {Buffer} fileBuff File buffer
   * @param  {string} charset  Charset
   * @param  {Set}    words    Word list
   * @return {Object}
   */
  private getWordsList(
    fileBuff: Buffer,
    charset: string,
    words: Set<string>
  ): FileResult {
    // Reading and convert file
    const text: string = iconv.decode(fileBuff, charset)

    const list: string[] = text.split('\n')
    let len: number = list.length
    // Remove last item if is empty
    if (list[len - 1] === '') {
      len--
    }

    // Add to collection
    let i = 0
    while (i < len) {
      words.add(list[i])
      i++
    }

    // Remove empty element
    words.delete('')

    return {
      words,
      size: len
    }
  }

  /**
   * Returns an object containing a list of words and their number
   * @private
   * @param  {string} input   The name or path of the word library
   * @param  {string} charset Charset
   * @param  {Set}    words   Word list
   * @return {Object}
   */
  private readDictionarySync(
    input:   string,
    charset: string,
    words:   Set<string>
  ): FileResult {
    if (this.dictionaries[input] != null) {
      charset = this.dictionaries[input].charset
      input   = this.dictionaries[input].src
    }

    // Log error if file is not exists
    if (!fs.existsSync(input)) {
      console.error(`ERROR! File "${input}" does not exist`)
      return { words, size: 0 }
    }

    // Log error if file is not exists
    if (!fs.existsSync(input)) {
      console.error(`ERROR! File "${input}" does not exist`)
      return {
        words,
        size: 0
      }
    }

    // Synchronious loading
    const buff = fs.readFileSync(input)
    return this.getWordsList(buff, charset, words)
  }

  /**
   * Returns the Promise to receive an object containing a list of words and
   * their number
   * @private
   * @param  {string} input   Название или путь библиотеки слов
   * @param  {string} charset Кодировка
   * @param  {Set}    words   Список слов
   * @return {Object}
   */
  private async readDictionaryAsync(
    input:   string,
    charset: string,
    words:   Set<string>
  ): Promise<FileResult> {
    if (this.dictionaries[input] != null) {
      charset = this.dictionaries[input].charset
      input   = this.dictionaries[input].src
    }

    // Log error if file is not exists
    if (!fs.existsSync(input)) {
      console.error(`ERROR! File "${input}" does not exist`)
      return { words, size: 0 }
    }

    // Asynchronious loading
    const filePath: string = input
    const fileBuff: Buffer = await this.readFile(filePath)
    const wordsList: FileResult = this.getWordsList(
      fileBuff,
      charset,
      words,
    )

    return wordsList
  }

  /**
   * Async reading file
   * @param  {string} filePath Path to file
   * @return {Promise}
   */
  private readFile(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (error: Error, buffer: Buffer) => {
        if (error) {
          reject(error)
        }

        resolve(buffer)
      })
    })
  }
}

/** @exports */
module.exports = new SpellChecker()
