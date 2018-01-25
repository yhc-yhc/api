require('./global.js')
const Koa = require('koa')
const logger = require('koa-logger')
const router = require('./router.js')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
app.use(logger())
app.use(bodyParser())

app.use(async(ctx, next) => {
	const start = new Date()
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
			message: err.message,
			stack: err.stack
		}
		throw err
	}

	if (ctx.body) {
		ctx.body = {
			status: 200,
			message: 'success',
			reslut: ctx.body
		}
	} else {
		ctx.body = httpStatus.success
	}
})

// api is exists
app.use(async(ctx, next) => {
	let url = ctx.request.url
	if (ctx.method == 'GET') {
		url = url.split('?')[0]
	}
	ctx._url = url
	let b = httpStatus[url] && httpStatus[url][ctx.method]
	if (!b) {
		throw httpStatus.notFound
	}
	await next()
})

// api params is correct
app.use(async(ctx, next) => {
	const params = ctx.request.method == 'GET' ? ctx.request.query : ctx.request.body
	let b = true 
	for (let k in httpStatus[ctx._url][ctx.method].params) {
		if (httpStatus[ctx._url][ctx.method].params[k]) {
			if (!params[k]) {
				b = false 
				break
			}
		}
	}
	if (!b) {
		throw httpStatus.paramErr
	}
	await next()
})



router(app)

app.listen(config.port, () => log(`Koa start at ${config.port}...`))


// url valid

// app.use(async(ctx, next) => {
// 	let exists_valid = false
// 	if (exists_valid) {
// 		await next()
// 	} else {
// 		 throw new Error({
// 			status: 4001,
// 			message: 'api address not found',
// 			data: {
// 				url: ctx.url
// 			}
// 		})
// 	}

// 	let param_valid = false 
// 	if (param_valid) {
// 		await next()
// 	} else {
// 		throw new Error({
// 			status: 4002,
// 			message: 'params pass error',
// 			data: {
// 				method: ctx.request.method,
// 				url: ctx.url,
// 				params: ctx.request.method == 'GET' ? ctx.request.query : ctx.request.body
// 			}
// 		})
// 	}

// 	log(6)
// })