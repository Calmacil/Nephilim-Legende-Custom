
// Jet vécus passés, quêtes et savoirs ésos

on('clicked:repeating_epoques-incarnation:vecu', evt => {
    let rowId = evt.triggerName.split('_')[2]
    const field = value => `repeating_epoques-incarnation_${rowId}_${value}`

    let attrs = [
        'vecu', 'degres_vecu_passe', 'approche',
        'use_mnemos1', 'degres_mnemos1', 'mnemos1',
        'use_mnemos2', 'degres_mnemos2', 'mnemos2'
    ].map(value => field(`${value}`))

    // Ka Dom is not row dependant
    attrs.push('KaDominant')

    getAttrs(attrs, v => {

        // Messages
        let messages = {
            rollTitle: v[field('vecu')],
            titleLabel: 'Utilise son expérience de'
        }

        // Basic parsing
        let approche = v[field('approche')]
        let degres_vecu_passe = parseInt(v[field('degres_vecu_passe')])||0
        let useMetamorphe = approche == 'ka' + v['KaDominant'].toLowerCase()

        // Mnemos management
        let degres_mnemos1 = parseInt(v[field('degres_mnemos1')])||0
        if (v[field('use_mnemos1')] == 'on') {
            degres_vecu_passe += degres_mnemos1
            messages.mnemos1 = v[field('mnemos1')]
        }

        let degres_mnemos2 = parseInt(v[field('degres_mnemos2')])||0
        if (v[field('use_mnemos2')] == 'on') {
            degres_vecu_passe += degres_mnemos2
            messages.mnemos2 = v[field('mnemos2')]
        }

        // Final opts object
        let opts = {
            seuil: degres_vecu_passe,
            usePhysicalWounds: true,
            approche: approche === '' ? undefined : approche,
            useMagicalWounds: approche !== '',
            useMetamorphe: useMetamorphe
        }

        doRoll('base2', opts, messages)
    })
})

on('clicked:repeating_quetes-eso', evt => {
    let rowId = evt.triggerName.split('_')[2]
    const field = value => `repeating_quetes-eso_${rowId}_${value}`

    let attrs = ['quete_eso', 'quete_eso_degres', 'quete-eso-perso']
        .map(value => field(`${value}`))

    getAttrs(attrs, v => {console.log(v)
        let title = v[field('quete_eso')]
        if (title === "0") title = v[field('quete-eso-perso')]
        let degre = parseInt(v[field('quete_eso_degres')])||0

        doRoll(
            'base2',
            {seuil: degre, usePhysicalWounds: true},
            {rollTitle: title, titleLabel: 'Fait appel à son savoir'}
        )
    })
})


on('clicked:repeating_savoir-eso', evt => {
    let rowId = evt.triggerName.split('_')[2]
    const field = value => `repeating_savoir-eso_${rowId}_${value}`

    let attrs = ['savoir_eso', 'savoir_eso_degres', 'savoir-eso-perso']
        .map(value => field(`${value}`))

    getAttrs(attrs, v => {
        let title = v[field('savoir_eso')]
        if (title === "0") title = v[field('savoir-eso-perso')]
        let degre = parseInt(v[field('savoir_eso_degres')])||0

        doRoll(
            'base2',
            {seuil: degre, usePhysicalWounds: true},
            {rollTitle: title, titleLabel: 'Fait appel à son savoir'}
        )
    })
})