"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
var iconv = require("iconv-lite");
var XRegExp = require("xregexp");
var SpellChecker = (function () {
    function SpellChecker() {
        this.BUFFER = {
            WORDS: new Set(),
            SIZE: 0,
        };
        this.dictionaries = {
            ru: {
                src: path_1.resolve(__dirname, '../dictionaries/ru/russian.txt'),
                charset: 'windows-1251'
            },
            ru_surnames: {
                src: path_1.resolve(__dirname, '../dictionaries/ru/russian_surnames.txt'),
                charset: 'windows-1251'
            },
            en: {
                src: path_1.resolve(__dirname, '../dictionaries/en/english.txt'),
                charset: 'windows-1252'
            },
        };
    }
    SpellChecker.prototype.load = function (inputOrProps, charsetOption) {
        var _this = this;
        var options = this.parseParams(inputOrProps, charsetOption);
        if (!options.async) {
            var dictionary = this.readDictionarySync(options.input, options.charset, this.BUFFER.WORDS);
            this.BUFFER.WORDS = dictionary.words;
            this.BUFFER.SIZE += dictionary.size;
            return dictionary.size;
        }
        else {
            var dictPromise_1 = this.readDictionaryAsync(options.input, options.charset || 'utf8', this.BUFFER.WORDS);
            return new Promise(function (resolve) {
                dictPromise_1.then(function (resp) {
                    _this.BUFFER.WORDS = resp.words;
                    _this.BUFFER.SIZE += resp.size;
                    resolve(resp.size);
                });
            });
        }
    };
    SpellChecker.prototype.clear = function () {
        this.BUFFER.WORDS.clear();
        this.BUFFER.SIZE = 0;
    };
    SpellChecker.prototype.check = function (text) {
        if (this.BUFFER.SIZE === 0) {
            console.error('ERROR! Dictionaries are not loaded');
            return;
        }
        var regex = XRegExp('[^\\p{N}\\p{L}-_]', 'g');
        var textArr = text
            .replace(regex, ' ')
            .split(' ')
            .filter(function (item) { return item; });
        var outObj = {};
        for (var i = 0; i < textArr.length; i++) {
            var checked = this.checkWord(textArr[i]);
            var checkedList = Array.isArray(checked)
                ? checked
                : [checked];
            for (var j = 0; j < checkedList.length; j++) {
                if (checkedList[j] == null) {
                    outObj[textArr[i]] = true;
                }
            }
        }
        return Object.keys(outObj);
    };
    Object.defineProperty(SpellChecker.prototype, "words", {
        get: function () {
            return this.BUFFER.WORDS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpellChecker.prototype, "size", {
        get: function () {
            return this.BUFFER.SIZE;
        },
        enumerable: true,
        configurable: true
    });
    SpellChecker.prototype.parseParams = function (inputOrProps, charsetOption) {
        if (typeof inputOrProps !== 'string') {
            return {
                input: inputOrProps.input,
                charset: inputOrProps.charset || 'utf8',
                async: inputOrProps.async,
            };
        }
        return {
            input: inputOrProps,
            charset: charsetOption || 'utf8',
            async: false,
        };
    };
    SpellChecker.prototype.checkWord = function (wordProp, recblock) {
        var _this = this;
        if (wordProp == null || wordProp === '' || !isNaN(Number(wordProp))) {
            return;
        }
        var word = wordProp.replace(/^#/, '');
        if (this.BUFFER.WORDS.has(word)) {
            return true;
        }
        if (this.BUFFER.WORDS.has(word.toLowerCase())) {
            return true;
        }
        var esymb = '-/\'';
        for (var i = 0; i < esymb.length; i++) {
            if (recblock || word.indexOf(esymb[i]) === -1) {
                continue;
            }
            var retArray = word
                .split(esymb[i])
                .map(function (item, i) {
                if (i === 0) {
                    return _this.checkWord(item, true);
                }
                else {
                    var res = _this.checkWord(item, true);
                    return res || _this.checkWord(esymb[i] + item, true);
                }
            });
            return retArray;
        }
    };
    SpellChecker.prototype.getWordsList = function (fileBuff, charset, words) {
        var text = iconv.decode(fileBuff, charset);
        var list = text.split('\n');
        var len = list.length;
        if (list[len - 1] === '') {
            len--;
        }
        var i = 0;
        while (i < len) {
            words.add(list[i]);
            i++;
        }
        words.delete('');
        return {
            words: words,
            size: len
        };
    };
    SpellChecker.prototype.readDictionarySync = function (input, charset, words) {
        if (this.dictionaries[input] != null) {
            charset = this.dictionaries[input].charset;
            input = this.dictionaries[input].src;
        }
        if (!fs.existsSync(input)) {
            console.error("ERROR! File \"" + input + "\" does not exist");
            return { words: words, size: 0 };
        }
        if (!fs.existsSync(input)) {
            console.error("ERROR! File \"" + input + "\" does not exist");
            return {
                words: words,
                size: 0
            };
        }
        var buff = fs.readFileSync(input);
        return this.getWordsList(buff, charset, words);
    };
    SpellChecker.prototype.readDictionaryAsync = function (input, charset, words) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, fileBuff, wordsList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.dictionaries[input] != null) {
                            charset = this.dictionaries[input].charset;
                            input = this.dictionaries[input].src;
                        }
                        if (!fs.existsSync(input)) {
                            console.error("ERROR! File \"" + input + "\" does not exist");
                            return [2, { words: words, size: 0 }];
                        }
                        filePath = input;
                        return [4, this.readFile(filePath)];
                    case 1:
                        fileBuff = _a.sent();
                        wordsList = this.getWordsList(fileBuff, charset, words);
                        return [2, wordsList];
                }
            });
        });
    };
    SpellChecker.prototype.readFile = function (filePath) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filePath, function (error, buffer) {
                if (error) {
                    reject(error);
                }
                resolve(buffer);
            });
        });
    };
    return SpellChecker;
}());
module.exports = new SpellChecker();
//# sourceMappingURL=index.js.map