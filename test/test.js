const spell  = require('../spell-checker');
const expect = require('chai').expect;


describe('Spell checking', function() {
    describe('English checking', function() {
        it('Loading English dictionary', function() {
            spell.clear();
            spell.load({input: 'en', time: false})
        });

        it('Checking', function() {
            expect(spell.check('London')).to.have.length(0)
            expect(spell.check('is')).to.have.length(0)
            expect(spell.check('the')).to.have.length(0)
            expect(spell.check('capital')).to.have.length(0)
            expect(spell.check('of Great Britain')).to.have.length(0)

            expect(spell.check('Blahblahblah')).to.have.length(1)
            expect(spell.check('Blahblahblah blahblah')).to.have.length(2)
            expect(spell.check('Hello')).to.have.length(0)
            expect(spell.check('Привет всем')).to.have.length(2)
        });
    });

    describe('Russian checking', function() {
        it('Loading Russian dictionary', function() {
            spell.clear();
            spell.load({input: 'ru', time: false})
        });

        it('Checking', function() {
            expect(spell.check('Приступая')).to.have.length(0)
            expect(spell.check('к доказательству')).to.have.length(0)
            expect(spell.check('следует')).to.have.length(0)
            expect(spell.check('заявить')).to.have.length(0)
            expect(spell.check('что лемма неоднозначна')).to.have.length(0)

            expect(spell.check('Блаблабла')).to.have.length(1)
            expect(spell.check('Blahblahblah blahblah')).to.have.length(2)
            expect(spell.check('Привет всем')).to.have.length(0)
            expect(spell.check('Hello')).to.have.length(1)
        });
    });

    describe('Russian surnames checking', function() {
        it('Loading Russian dictionary', function() {
            spell.clear();
            spell.load({input: 'ru_surnames', time: false})
        });

        it('Checking', function() {
            expect(spell.check('Иванов')).to.have.length(0)
            expect(spell.check('Петров')).to.have.length(0)
            expect(spell.check('Сидоров')).to.have.length(0)

            expect(spell.check('Блаблабла')).to.have.length(1)
            expect(spell.check('не фамилия')).to.have.length(2)
        });
    });
})
