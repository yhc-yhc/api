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

router.post('thirdLogin', async (ctx, next) => {
	let user
	const loginParam = {
		token: ctx.params.access_token,
		openid: ctx.params.openid,
		LG: ctx.params.lg,
		_url: ctx._url,
		terminal: ctx.params.terminal,
		fbId:ctx.params.fbId,
		fbName:ctx.params.fbName
	}

	//判断接收的是wx/fb	
	const login_type = ctx.params.type
	switch (login_type) {
		case 'wx':
			user = await services.user.wxLogin(loginParam)
			break;
		case 'fb':
			user = await services.user.fbLogin(loginParam)
			log('facebook获取的user:', user)
			break;

	}
	log(28, user)
	const user_name = user.userName
	await model.user.update({
		userName: user_name
	}, {
		$set: user
	}, {
		upsert: true
	})
	const _user = await model.user.findOne({
		userName: user_name
	}, {
		_id: 1
	})
	const userid = _user._id.toString()

	const tokenParams = {
		lg: ctx.params.lg,
		t: ctx.params.terminal,
		visitIP: ctx.request.ip.replace(/::ffff:/g, ''),
		uuid: ctx.params.uuid
	}
	const access_token = await services.user.createToken(user_name, tokenParams)
	const key = 'access_token:' + endeurl.md5(user_name)
	cache.set(key, JSON.stringify({
		userid,
		user
	}), 'EX', 604800) // 7*24*60*60
	ctx.body = {
		token: access_token
	}
})



module.exports = router