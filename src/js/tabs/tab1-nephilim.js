
const metaFieldsChange = {metamorphose: ['permanent']}
on(section_changes(metaFieldsChange, true), () => {
    getSectionObject(metaFieldsChange, data => {
        getAttrs(data.fields, v => {
            let total = 0;
            data.fields.forEach(field => {
                total += parseInt(v[field])||0
            })
            setAttrs({permanentMeta: total})
        })
    })
})

// Raw ka elem rolls
on('clicked:kafeu clicked:katerre clicked:kaair clicked:kalune clicked:kaeau', evt => {
    let attrKa = parseTriggerName(evt.triggerName)
    getAttrs([attrKa, 'KaDominant'], v => {
        let degreKa = parseInt(v[attrKa])||0
        let useMetamorphe = 'ka' + v.KaDominant.toLowerCase() == attrKa
        doRoll('base2', {seuil: degreKa, useMetamorphe: useMetamorphe}, {rollTitle: evt.htmlAttributes.value})
    })
})