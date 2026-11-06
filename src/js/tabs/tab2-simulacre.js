
// Simulacre rolls
/**
 * Fait un jet de vécu contemporain
 * @param {string} vecu Le nom du vécu mis en jeu
 * @param {number} vecuDegre Le degré du vécu
 * @param {string} approche L'approche élémentaire mise en jeu, si elle existe
 * @param {string} kadom L'élément dominant du neph. Oui, c'est nécessaire.
 */
const rollSimulacre = (vecu, vecuDegre, approche, kadom) => {
    let useMetamorphe = approche === 'ka' + kadom.toLowerCase()

    let opts = {
        seuil: vecuDegre,
        usePhysicalWounds: true,
        approche: (approche === '') ? undefined : approche,
        useMagicalWounds: (approche !== ''),
        useMetamorphe: useMetamorphe
    }

    doRoll('base2', opts, {'rollTitle': vecu, 'titleLabel': 'Utilise son expérience de'})
}

on('clicked:vecu', () => {
    getAttrs(['simu_vecu', 'simu-vecu-nbr', 'approche1', 'KaDominant'], v => {
        rollSimulacre(v.simu_vecu, v['simu-vecu-nbr'], v.approche1, v.KaDominant)
    })
})

on('clicked:vecu2', () => {
    getAttrs(['simu_vecu2', 'simu-vecu-nbr2', 'approche2', 'KaDominant'], v => {
        rollSimulacre(v.simu_vecu2, v['simu-vecu-nbr2'], v.approche2, v.KaDominant)
    })
})
