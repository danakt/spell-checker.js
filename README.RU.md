# Spell-checker.js
Простой гибкий иструмент для проверки орфографии.

[![npm](https://img.shields.io/npm/v/spell-checker-js.svg?style=flat-square)](https://www.npmjs.com/package/spell-checker-js)
[![Travis branch](https://img.shields.io/travis/danakt/spell-checker.js/master.svg?style=flat-square)](https://travis-ci.org/danakt/spell-checker.js)

Readme: [`English`](README.md) **`Русский`** 

## Поддержка языков
* Русский
* Английский

## Быстрый старт
**Установка:**  
`npm i spell-checker-js`

**Использование:**
```js
const spell = require('spell-checker-js')

// Подгрузка словаря
spell.load('en')

// Проверка орфографии
const check = spell.check('Some text to check, blahblahblah, olololo')

console.log(check)
// -> ['blahblahblah', 'olololo']
```

## Методы и свойства
### `spell.load(dictionary)` или `spell.load(options)` — загрузка файла со словарём

**Примеры:**
```js
// Способы подгрузки стандартного словря:
spell.load('ru')
spell.load({ input: 'ru' })

// Подгрузка пользовательского словаря:
spell.load('./my_custom_dictionary.txt')

// Подгрузка пользовательского словаря с кодировкой:
spell.load({ input: './my_custom_dictionary.txt', charset: 'windows-1251' })

// Асинхронная подгрузка стандартного словаря
spell.load({ input: 'en', async: true }).then(len => {
    console.log(len);
    // len — количество подгруженных слов
    spell.check('something')
})
```

**Список стандартных словарей:**
* `en` — словарь с английскими словами
* `ru` — словарь с русскими словами
* `ru_surnames` — словрь с русскими 

Вы можете помочь проекту, добавив словари с другими языками.

### `spell.check(string)` — проверка орфографии текста
**Возвращает:** массив с неправильными словами  
**Пример:**
```js
spell.load('en')

const check = spell.check('Some text to check, blahblahblah, olololo')

console.log(check)
// -> ['blahblahblah', 'olololo']
```

### `spell.clear()` — очистка подгруженных словрей
**Пример:**
```js
spell.load('en')

spell.clear()
spell.check('something')

// -> ERROR! Dictionaries are not loaded
```

### `spell.size` — количество подгруженных слов
**Пример**
```js
spell.load('en')
spell.load('ru')

console.log(spell.size)
// -> 1956898
```
