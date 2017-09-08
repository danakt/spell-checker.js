/**
 * Spell-checker.js
 * Simple expandable tool for spell checking
 * @author Danakt Frost <mail@danakt.ru>
 *
 * @todo Add support word prefixes (авто...)
 */
const SpellChecker = require('./dist/spell-checker').default
module.exports = new SpellChecker()
