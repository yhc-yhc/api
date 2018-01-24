const Router = require('koa-router')
const router = new Router()
router.get('sendsms', async(ctx, next) => {
	log(ctx.url, ctx.query)
	let code = await cache.getAsync(`smscode_`)
	log(code)
	if (code) return ctx.body = extRes.resFomat(425, 'sms Sending')

	let vcode = ('' + Math.random()).match(/\d{6}/)[0]
	cache.set("smscode_", vcode, 'EX', config.sms.vCodeExpireTime)
	// await sendsms(86, 18625908643, config.sms.tpl_map.register, [vcode])
	ctx.body = extRes.resFomat(200, 'success')
})

router.post('sendsms', async(ctx, next) => {
	log(ctx.request.body)
	let code = await cache.getAsync(`smscode_`)
	// log(code)
	if (code) return ctx.body = extRes.resFomat(425, 'sms Sending')

	let vcode = ('' + Math.random()).match(/\d{6}/)[0]
	cache.set("smscode_", vcode, 'EX', config.sms.vCodeExpireTime)
	// await sendsms(86, 18625908643, config.sms.tpl_map.register, [vcode])
	ctx.body = extRes.resFomat(200, 'success')
})
module.exports = router