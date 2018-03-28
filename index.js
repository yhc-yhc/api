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
			status: err.status || 10001,
			message: err.message,
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
	ctx.LG = 'en-US'
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
	let b = httpStatus[service] && httpStatus[service][fun] &&
		httpStatus[service][fun].method.toUpperCase() == ctx.method.toUpperCase()
	if (!b) {
		throw {
			status: 1007,
			message: httpStatus.common.system['10007'][ctx.LG],
			router: ctx.url
		}
	}
	await next()
})

// api params is correct
app.use(async(ctx, next) => {
	const params = ctx.method == 'GET' ? ctx.req.query : ctx.req.body
	ctx.params = params
	const header = ctx.header
	let b = true
	const headers = httpStatus[ctx.service][ctx.fun].headers
	for (let header in headers) {
		if (!headers[header][0] || headers[header][1] == 'Binary') continue
		let bflag = ctx.headers[header]
		if (!bflag) {
			b = false
			break
		}
		if (header == 'token') {
			const token = ctx.headers[header]
			if (!certs.public) {
				await loadCert()
			}
			let tokenObj = {}
			try {
				tokenObj = jwt.verify(token, certs.public, {
					algorithm: 'RS512'
				})
			} catch (err) {
				throw {
					status: 10005,
					message: httpStatus.common.system['10005'][ctx.LG],
					router: ctx.url
				}
			}
			let userStr = await cache.getAsync('access_token:' + tokenObj.audience)
			if (!userStr) {
				throw {
					status: 10005,
					message: httpStatus.common.system['10005'][ctx.LG],
					router: ctx.url
				}
			} else {
				log(userStr)
				ctx.user = JSON.parse(userStr)
			}
		}
	}
	if (!b) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006'][ctx.LG],
			router: ctx.url
		}
	}
	const _params = httpStatus[ctx.service][ctx.fun].params
	for (let param in _params) {
		if (!_params[param][0] || _params[param][1] == 'Binary') continue
		let bflag = params[param]
		if (!bflag) {
			b = false
			break
		}
	}
	if (!b) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006'][ctx.LG],
			router: ctx.url
		}
	}
	await next()
})

router(app)

app.listen(config.port, () => log(`Koa start at ${config.port}...`))