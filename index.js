require('./global.js')
const Koa = require('koa')
const logger = require('koa-logger')
const router = require('./router.js')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(bodyParser())

app.use(logger())
router(app)
app.use(async ctx => {
	ctx.body = resInfo.urlError
})
app.listen(config.port, () => log(`Koa start at ${config.port}...`))