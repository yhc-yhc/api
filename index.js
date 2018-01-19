require('./global.js')
const Koa = require('koa')
const logger = require('koa-logger')
const router = require('./router.js')
const app = new Koa()
app.use(logger())
router(app)
// async function main(app) {

// 	await router(app)
// }
// main(app)
app.listen(config.port, () => log(`Koa start at ${config.port}...`))