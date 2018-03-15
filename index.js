require('./global.js')
	// require('./main.js')
const Koa = require('koa')
const logger = require('koa-logger')
const router = require('./router.js')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(logger())
app.use(bodyParser())

app.use(async(ctx, next) => {
	const start = new Date()
	ctx.method == 'GET' ? ctx.req.query = ctx.request.query : ctx.req.body = ctx.request.body
	let ms
	try {
		await next()
		ms = new Date() - start
		logUtil.logResponse(ctx, ms)
	} catch (err) {
		ms = new Date() - start
		logUtil.logError(ctx, err, ms)
	}
})

// format api response result
app.use(async(ctx, next) => {
	try {
		await next()
	} catch (err) {
		ctx.body = {
			status: err.status || 500,
			msg: err.message,
			result: {
				router: err.router,
				stack: err.stack
			}
		}
		throw err
	}

	if (ctx.body) {
		const obj = Object.assign({}, httpStatus.common.success)
		obj.result = ctx.body
		ctx.body = obj
	} else {
		ctx.body = httpStatus.common.success
	}
})

// api is exists
app.use(async(ctx, next) => {
	let url = ctx.url
	if (ctx.method == 'GET') {
		url = url.split('?')[0]
	}
	const ary = url.split('/')
	let service = ary[1]
	let fun = ary[2]
	ctx._url = url
	ctx.service = service 
	ctx.fun = fun
	let b = httpStatus[service] && httpStatus[service][fun] 
	&& httpStatus[service][fun].method.toUpperCase() == ctx.method.toUpperCase()
	if (!b) {
		throw {
			status: 1007,
			message: httpStatus.common.system['10007']['en-US'],
			router: ctx.url
		}
	}
	await next()
})

// api params is correct
app.use(async(ctx, next) => {
	const params = ctx.method == 'GET' ? ctx.req.query : ctx.req.body
	const header = ctx.header
	let b = true
	const  headers = httpStatus[ctx.service][ctx.fun].headers
	for (let header in headers) {
		if (!ctx.headers[header]) {
			b = false 
			break
		}
	}
	if (!b) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006']['en-US'],
			router: ctx.url
		}
	}
	const  _params = httpStatus[ctx.service][ctx.fun].params
	for (let param in _params) {
		if (!params[param]) {
			b = false 
			break
		}
	}
	if (!b) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006']['en-US'],
			router: ctx.url
		}
	}
	await next()
})

router(app)

app.listen(config.port, () => log(`Koa start at ${config.port}...`))