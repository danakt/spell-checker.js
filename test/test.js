const path   = require('path')
const expect = require('chai').expect
const spell  = require('../bin/spell-checker')

// English dictionary ----------------------------------------------------------
describe('English dictionary', () => {
    it('Load dictionary', () => {
        spell.clear()
        spell.load({ input: 'en' })
    })

    it('Spell checking', () => {
        expect(spell.check('London')).to.have.length(0)
        expect(spell.check('is')).to.have.length(0)
        expect(spell.check('the')).to.have.length(0)
        expect(spell.check('capital')).to.have.length(0)
        expect(spell.check('of Great Britain')).to.have.length(0)

        expect(spell.check('Blahblahblah')).to.have.length(1)
        expect(spell.check('Blahblahblah blahblah')).to.have.length(2)
        expect(spell.check('Hello')).to.have.length(0)
        expect(spell.check('Привет всем')).to.have.length(2)
    })

    it('Spell checking long', () => {
        let check = spell.check(
            `Comfort reached gay perhaps chamber his six detract besides
            add. Moonlight newspaper up he it enjoyment agreeable
            depending. Timed voice share led his widen noisy young. On
            weddings believed laughing although material do exercise of.
            Up attempt offered ye civilly so sitting to. She new course
            get living within elinor joy. She her rapturous suffering
            concealed.

            She literature discovered increasing how diminution understood.
            Though and highly the enough county for man. Of it up he still
            court alone widow seems. Suspected he remainder rapturous my
            sweetness. All vanity regard sudden nor simple can. World mrs
            and vexed china since after often.

            He an thing rapid these after going drawn or. Timed she his
            law the spoil round defer. In surprise concerns informed
            betrayed he learning is ye. Ignorant formerly so ye blessing.
            He as spoke avoid given downs money on we. Of properly
            carriage shutters ye as wandered up repeated moreover.
            Inquietude attachment if ye an solicitude to. Remaining so
            continued concealed as knowledge happiness. Preference did
            how expression may favourable devonshire insipidity considered.
            An length design regret an hardly barton mr figure. `
        )

        expect(check).to.have.length(1)
    })
})

// Russian dictionary ----------------------------------------------------------
describe('Russian dictionary', () => {
    it('Load dictionary', () => {
        spell.clear()
        spell.load({ input: 'ru' })
    })

    it('Spell checking', () => {
        expect(spell.check('Приступая')).to.have.length(0)
        expect(spell.check('к доказательству')).to.have.length(0)
        expect(spell.check('следует')).to.have.length(0)
        expect(spell.check('заявить')).to.have.length(0)
        expect(spell.check('что лемма неоднозначна')).to.have.length(0)

        expect(spell.check('Блаблабла')).to.have.length(1)
        expect(spell.check('Blahblahblah blahblah')).to.have.length(2)
        expect(spell.check('Привет всем')).to.have.length(0)
        expect(spell.check('Hello')).to.have.length(1)
    })

    it('Spell checking long', () => {
        let check = spell.check(
            `Генеративная поэтика, на первый взгляд, нивелирует музыкальный
            цикл, потому что в стихах и в прозе автор рассказывает нам об
            одном и том же. Эстетическое воздействие текстологически
            приводит культурный речевой акт и передается в этом
            стихотворении Донна метафорическим образом циркуля. Замысел,
            без использования формальных признаков поэзии, начинает
            дактиль, таким образом постепенно смыкается с сюжетом.

            Мифопоэтическое пространство, согласно традиционным
            представлениям, отталкивает былинный акцент. Декодирование,
            несмотря на то, что все эти характерологические черты отсылают
            не к единому образу нарратора, перпендикулярно. Цитата как бы
            придвигает к нам прошлое, при этом мелькание мыслей лабильно.

            Стихотворение аннигилирует урбанистический генезис свободного
            стиха. Из приведенных текстуальных фрагментов видно, как
            матрица просветляет цикл. Показательный пример – эпическая
            медлительность выбирает метафоричный холодный цинизм. Похоже,
            что самого Бахтина удивила эта всеобщая порабощенность тайной
            "чужого" слова, тем не менее контрапункт редуцирует метаязык,
            и это придает ему свое звучание, свой характер.`
        )

        expect(check).to.have.length(3)
    })
})

// Russian surnames dictionary -------------------------------------------------
describe('Russian surnames dictionary', () => {
    it('Load dictionary', () => {
        spell.clear()
        spell.load({ input: 'ru_surnames' })
    })

    it('Spell checking', () => {
        expect(spell.check('Иванов')).to.have.length(0)
        expect(spell.check('Петров')).to.have.length(0)
        expect(spell.check('Сидоров')).to.have.length(0)

        expect(spell.check('Блаблабла')).to.have.length(1)
        expect(spell.check('не фамилия')).to.have.length(2)
    })
})

// Custom dictionary -----------------------------------------------------------
describe('Custom dictionary', () => {
    it('Load dictionary', () => {
        spell.clear()
        spell.load({
            input: './test/test_dict.txt'
        })
    })

    it('Spell checking', () => {
        expect(spell.check('Γεια')).to.have.length(0)
        expect(spell.check('καλός')).to.have.length(0)

        expect(spell.check('γαμημένος')).to.have.length(1)

    })
});

// Compare dictionaries --------------------------------------------------------
describe('Combined English and Russian dictionaries', () => {
    it('Load dictionaries', () => {

        spell.clear()
        spell.load('en')
        spell.load('ru')
    })

    it('Spell checking', () => {
        expect(spell.check('Приступая')).to.have.length(0)
        expect(spell.check('к доказательству')).to.have.length(0)
        expect(spell.check('следует')).to.have.length(0)
        expect(spell.check('заявить')).to.have.length(0)
        expect(spell.check('что лемма неоднозначна')).to.have.length(0)

        expect(spell.check('London')).to.have.length(0)
        expect(spell.check('is')).to.have.length(0)
        expect(spell.check('the')).to.have.length(0)
        expect(spell.check('capital')).to.have.length(0)
        expect(spell.check('of Great Britain')).to.have.length(0)


        expect(spell.check('Блаблабла')).to.have.length(1)
        expect(spell.check('Blahblahblah blahblah')).to.have.length(2)
        expect(spell.check('γαμημένος')).to.have.length(1)
    })
});
