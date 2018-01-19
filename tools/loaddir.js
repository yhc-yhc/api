const fs = require('fs')
const path = require('path')
module.exports = dir => {
    const obj = {}
    // console.log(process.env.PWD, process.env.HOME)
    let url = `${process.env.PWD}/${dir}`
    const files = fs.readdirSync(url)
    // console.log(files)
    for (let file of files) {
        if (!/\.js$/.test(file)) return
        let name = path.basename(file, path.extname(file))
        let fileurl = `${url}/${file}`
        // console.log(name, fileurl)
        obj[name] = require(fileurl)
    }
    // console.log(obj)
    return obj
}