const Router = require('koa-router')
const router = new Router()

router.post('/', async(ctx, next) => {
	const body = ctx.req.body
	const api = httpStatus[ctx._url][ctx.method]
	let cacheKey = `smscode_${body.areaCode}${body.phone}`
	let code = await cache.getAsync(cacheKey)
	if (code) {
		log(cacheKey, code)
		throw api.error.smsSending || httpStatus.errorLoss
	}
	let vcode = ('' + Math.random()).match(/\d{6}/)[0]
	cache.set(cacheKey, vcode, 'EX', config.cacheExpire.smsvcode)
	const rs = await sendsms(body.areaCode, body.phone, config.sms.tpl_map.register, [vcode])
	if (rs.body.result) {
		log(rs.body)
		throw api.error.getSmsErr || httpStatus.errorLoss
	}
})

module.exports = router