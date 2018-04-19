const xml2js = require('xml2js')
const Parser = new xml2js.Parser()
exports.parseStringAsync = xml => {
    return new Promise((resolve, reject) => {
        Parser.parseString(xml, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
exports.objTostring = obj => {
    var preSign = '';
    for (let key in obj) {
        preSign += `${key}=${obj[key]}&`
    }
    return preSign
}

exports.objToXml = obj => {
    let xml = '<xml>'
    for (let key in obj) {
        xml += `<${key}>${obj[key]}</${key}>`
    }
    xml += '</xml>'
    return xml
}