require('./common/global.js')

const app = new Koa()
app.use(logger())
app.use(bodyParser({
	"formLimit": "10mb",
	"jsonLimit": "10mb",
	"textLimit": "10mb"
}))

app.use(async (ctx, next) => {
	const start = new Date()
	ctx.method == 'GET' ? ctx.req.query = ctx.request.query : ctx.req.body = ctx.request.body
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

	try {
		await next()
		if (ctx.service != 'sync') {
			let ms = new Date() - start
			logUtil.logResponse(ctx, ms)
		}
	} catch (err) {
		const response = httpStatus[ctx.service][ctx.fun].response || {}
		ctx.body = {
			status: err.status || 10001,
			message: err.message || httpStatus.common.system['10001'][ctx.LG],
			errorInfo: {
				router: err.router,
				stack: err.stack
			},
			result: Array.isArray(response) ? [] : {}
		}
		if (ctx.service != 'sync') {
			let ms = new Date() - start
			logUtil.logError(ctx, err, ms)
		}
	}
})

// format api response result
app.use(async (ctx, next) => {
	await next()
	if (ctx.body) {
		const obj = Object.assign({}, httpStatus.common.success)
		obj.result = ctx.body
		ctx.body = obj
	} else {
		ctx.body = httpStatus.common.success
	}
})

// api is exists
app.use(async (ctx, next) => {
	let b = httpStatus[ctx.service] && httpStatus[ctx.service][ctx.fun] &&
		httpStatus[ctx.service][ctx.fun].method.toUpperCase() == ctx.method.toUpperCase()
	if (!b) {
		throw {
			status: 10007,
			message: httpStatus.common.system['10007'][ctx.LG],
			router: ctx.url
		}
	}
	await next()
})

// api params is correct
app.use(async (ctx, next) => {
	if (ctx.request.is('multipart/*')) {
		const {
			files,
			fields
		} = await asyncBusboy(ctx.req)
		ctx.params = fields
		ctx.files = files.reduce((pre, cur) => {
			pre[cur.fieldname] = cur.path
			return pre
		}, {})
	} else {
		ctx.params = ctx.method == 'GET' ? ctx.req.query : ctx.req.body
	}
	let bPass = true
	const headers = httpStatus[ctx.service][ctx.fun].headers
	for (let header in headers) {
		if (header == 'token' || !headers[header][0]) continue
		let bflag = ctx.headers[header]
		if (!bflag) {
			bPass = false
			break
		}
	}
	if (!bPass) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006'][ctx.LG],
			router: ctx._url
		}
	}
	const params = httpStatus[ctx.service][ctx.fun].params
	for (let param in params) {
		if (param == 'token' || !params[param][0]) continue
		let bflag = ctx.params[param]
		params[param][1] == 'Binary' ? bflag = ctx.files && ctx.files[param] : ''
		if (!bflag) {
			bPass = false
			break
		}
	}
	if (!bPass) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006'][ctx.LG],
			router: ctx._url
		}
	}
	await next()
})

// api token is correct
app.use(async (ctx, next) => {
	log('登录的类型：'+ctx.params.type)
	if (global.httpStatus[ctx.service][ctx.fun].headers.token ||
		global.httpStatus[ctx.service][ctx.fun].params.token) {
		let token = ctx.headers.token || ctx.params.token
		if (!token) {
			throw {
				status: 10006,
				message: httpStatus.common.system['10006'][ctx.LG],
				router: ctx._url
			}
		}
		if (!certs.public) {
			await loadCert()
		}
		let tokenObj = {}
		try {
			tokenObj = jwt.verify(token, certs.public, {
				algorithm: 'RS512'
			})
		} catch (err) {
			error.status = 420
			throw err
		}
		let userStr = await cache.getAsync('access_token:' + tokenObj.audience)
		if (!userStr) {
			throw {
				status: 420,
				message: httpStatus.common.system['10005'][ctx.LG],
				router: ctx._url
			}
		} else {
			ctx.user = JSON.parse(userStr)

			log('ctx.user.user.uuid:'+ctx.user.user.uuid ,'tokenObj.uuid:'+tokenObj.uuid)

			if (ctx.user.user.uuid != tokenObj.uuid) {
				log('access_token来了')
				throw {
					status: 448,
					message: httpStatus.common.system['10005'][ctx.LG],
					router: ctx.url
				}
			}
		}
	}
	await next()
})

router(app)

app.listen(config.port, () => log(`Koa start at ${config.port}...`))