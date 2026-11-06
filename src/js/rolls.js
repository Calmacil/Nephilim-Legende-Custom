/**
 * Computes a roll's quality and margin
 *
 * @param {integer} degre The difficulty of the roll
 * @param {integer} result The numeric result of the roll
 * @param {boolean} isPulp Computation mode
 * @returns Object
 */
const _computeRollResult = (degre, result, isPulp=false) => {
    let isSuccess = 0, isCritical = 0, margin = 0
    let percent = 10 * degre

    if (isPulp && result >= 90 || result == 100) {
        isSuccess = 0
        isCritical = 1
    } else if (isPulp && result <= 10) {
        isSuccess = 1
        isCritical = 1
    } else {
        if (result <= percent) isSuccess = 1;
        if (result%11 == 0) isCritical = 1
    }

    if (isSuccess) {
        margin = Math.floor(result / 10) + Math.max(0, (degre - 10));
    }

    return {
        isSuccess: isSuccess,
        isCritical: isCritical,
        margin: margin
    }
}

/**
 * Performs a roll
 * @param {string} template The rolltemplate name
 * @param {Object} opts The mandatory options
 * @param {Object} messages An object of additional messages meant for display only
 */
const doRoll = (template = 'base', opts={}, messages={}) => {
    opts = {
        ...{
            seuil: 0,
            jet: '[[1d100]]',
            useMetamorphe: false,
            useMagicalWounds: false,
            usePhysicalWounds: false,
            approche: undefined,
        },
        ...opts
    }

    messages = {
        ...{
            rollTitle: '',
            titleLabel: 'Utilise son'
        },
        ...messages
    }

    let rollParts = [`&{template:${template}}`]
    let attrsToGet = ['character_name'];

    // Extra variables to check
    if (opts.useMetamorphe) attrsToGet.push('metamorphe', 'degreMetamorphe', 'permanentMeta')
    if (opts.usePhysicalWounds) attrsToGet.push('cons-min', 'cons-ser', 'cons-gra')
    if (opts.useMagicalWounds) attrsToGet.push('cons-mag-min', 'cons-mag-ser', 'cons-mag-gra')
    if (opts.approche !== undefined) attrsToGet.push(opts.approche)

    getAttrs(attrsToGet, v => {
        // Metamorphe management
        let seuil = parseInt(opts.seuil)||0;
        let activeMeta = parseInt(v.degreMetamorphe)||0
        let maxMeta = parseInt(v.metamorphe)||0
        let permanentMeta = parseInt(v.permanentMeta)||0

        if (opts.useMetamorphe && activeMeta) {
            let realActiveMeta = Math.min(activeMeta, (maxMeta - permanentMeta))
            seuil += realActiveMeta
            rollParts.push(`{{metamorphe=${realActiveMeta} degrés de métamorphe actifs}}`)
        }

        // Wounds management
        if (opts.usePhysicalWounds) {
            seuil -= v['cons-min'] == 'on' ? 2 : 0
            seuil -= v['cons-ser'] == 'on' ? 4 : 0
            seuil -= v['cons-gra'] == 'on' ? 6 : 0
        }

        if (opts.useMagicalWounds) {
            seuil -= v['cons-mag-min'] == 'on' ? 2 : 0
            seuil -= v['cons-mag-ser'] == 'on' ? 4 : 0
            seuil -= v['cons-mag-gra'] == 'on' ? 6 : 0
        }
        seuil = Math.max(0, seuil)

        if (opts.approche !== undefined) {
            let approche = parseInt(v[opts.approche])||0
            seuil += approche
            rollParts.push(`{{approche=Ka ${kapitalize(opts.approche)}}}`)
        }

        // Building the rollstring
        rollParts.push(
            `{{name=${v.character_name}}}`,
            `{{jet=${opts.jet}}}`,
            `{{seuil=[[${seuil}]]}}`,
            `{{mod=[[?{Bonus / Malus ?|0}]]}}`, // Automatically integrate mod here, simpler to remove it later
            `{{margin=[[0]]}}`,
            `{{isCritical=[[0]]}}`,
            `{{isSuccess=[[0]]}}`
        )

        const dynamicMessages = Object.entries(messages).map(([key, value]) => {return `{{${key}=${value}}}`})
        rollParts.push(dynamicMessages.join(' '))

        let rollString = rollParts.join(' ')
        console.log(rollString)

        // Fire !
        startRoll(rollString, rs => {
            seuil += parseInt(rs.results.mod.result)||0
            let results = _computeRollResult(seuil, rs.results.jet.result)
            let data = {
                isSuccess: results.isSuccess,
                isCritical: results.isCritical,
                margin: results.margin,
                seuil: 10 * seuil
            }
            // TODO add rk computations

            finishRoll(rs.rollId, data)
        })
    })
}