/**
 * Useful to build long change:thing strings
 * @param {Array} stats A list of stats to load in change string
 * @param {boolean} sheet_open Add sheet:opened or not
 * @returns string
 */
const build_changes = (stats, sheet_open=false) =>
    stats.reduce((all, stat) =>
        `${all} change:${stat.toLowerCase()}`, sheet_open ? 'sheet:opened' : '');

/**
 * Combine elements to create a full section attribute name
 * @param {string} section section name
 * @param {string} id row id
 * @param {string} field field name
 * @returns string
 */
const section_name = (section, id, field) =>
    `${section.startsWith('repeating_') ? section :
        `repeating_${section}`}_${id}_${field}`;

/**
 * break a full repeating section attribute name into its parts
 * @param {string} full_name The full section name
 * @param {string} part The section part you want
 * @returns string
 */
const section_parts = (full_name, part='section') => {
    let [stub, section, row, ...field] = full_name.split('_')
    if (part === 'section' || part === 1) return section
    else if (part === 'row' || part === 'id' || part === 2) return row
    else return field.join('_')
}

/**
 * Watch changes to build an event changes string
 * Use it like this:
 * const myFields = {
 *   globals: ['strength', 'constitution'],
 *   buffs: ['mod', 'cost'],
 *   gear: ['mod', 'cost]
 * }
 * on(section_changes(myFields), () => {
 *   getSectionObject(myFields, data => {
 *     getAttrs(data.fields, values => {})
 *   })
 * })
 * @param {Object} section_object An object containing the fields to watch
 * @returns string
 */
const section_changes = (section_object, sheet_open=false) => {
    let output = sheet_open ? 'sheet:opened ' : ''
    Object.keys(section_object).forEach((key, index) => {
        if (index) section += ' '
        section_object[key].forEach(field => {
            output += key === 'globals' ? field : `change:repeating_${key}:${field}`
        })
    })
    return output
}

const sum_section = (section, ids, fields, v) => {
    if (!Array.isArray(fields)) fields = [fields.replace(/\s/g, '').split('.')]
    console.warn(v)
    let total = 0
    const getValue = (section, id, field) => v[`repeating_${section}_${id}_${field}` === 'on' ? 1 : parseFloat(v[`repeating_${section}_${id}_${field}`])||0]
    ids.forEach(id => {
        let subtotal = 1;
        fields.forEach(field => subtotal *= getValue(section, id, field))
        total += subtotal
    })
    return total
}

/**
 * operate on multiple repeating sections at a time, getting a data object
 * which contains data.fields and data.each_section
 * @param {Array} sections The sections to fetch
 * @param {CallableFunction} callback The callback
 */
const getSectionObject = (sections, callback) => {
    const fields_object = {}
    fields_object.fields = []
    let keys = Object.keys(sections)
    const burndown = () => {
        let section = keys.shift()
        getSectionIDs(`repeating_${section}`, ids => {
            ids.forEach(id =>
                sections[section].forEach(field =>
                    fields_object.fields.push(`repeating_${section}_${id}_${field}`)
                )
            )
            fields_object[section] = ids
            if (keys.length) burndown();
            else callback(fields_object);
        })
    }
    burndown()
}

/**
 * Parses a var name from a trigger name (actButton)
 * @param {string} name The trigger name
 * @returns string
 */
const parseTriggerName = name => {
    return name.split(':')[1]
}

/**
 * Returns the full letters ka name from the ka attr name
 * @param {string} ka The ka attr name
 * @returns string
 */
const kapitalize = ka => {
    if (ka === 'kaln') return 'Lune Noire'
    if (ka === 'simu-kasoleil') return 'Soleil'
    return ka.charAt(2).toUpperCase() + ka.slice(3)
}