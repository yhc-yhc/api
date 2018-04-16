const Router = require('koa-router')
const router = new Router()
const services = loaddir('./services')

router.post('sendsms', async (ctx, next) => {
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

/*
 微信登录,获取用户信息
*/
router.post('thirdLogin', async (ctx, next) => {
	var user
	//判断接收的是wx/fb	
	const login_type = ctx.params.type
	switch (login_type) {
		case 'wx':
			user = await services.user.wxLogin(ctx)
			break;
		case 'fb':
			user = await services.user.fbLogin(ctx)
			log('facebook获取的user:',user)
			break;

	}
	log(28, user)
	await model.user.update({
		userName: user.userName
	}, {
		$set: user
	}, {
		upsert: true
	})
	const _user = await model.user.findOne({
		userName: user.userName
	}, {
		_id: 1
	})
	const userid = _user._id.toString()
	
	const access_token = await services.user.createToken(user,ctx)
	const key = 'access_token:' + endeurl.md5(user.userName)
	cache.set(key, JSON.stringify({
		userid,
		user
	}), 'EX', 604800) // 7*24*60*60
	ctx.body = {
		token: access_token
	}
})



module.exports = router