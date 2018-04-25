const router = new Router()
const services = loaddir('services')

router.post('sendSMS', async (ctx, next) => {
	let cacheKey = `smscode_${ctx.params.areaCode}${ctx.params.phone}`
	let code = await cache.getAsync(cacheKey)
	if (code) {
		log(cacheKey, code)
		throw {
			message: `${ctx.params.areaCode}-${ctx.params.phone} is sending...`
		}
	}
	let vcode = ('' + Math.random()).match(/\d{6}/)[0]
	cache.set(cacheKey, vcode, 'EX', config.cacheExpire.smsvcode)
	const rs = await services.user.sendSMS(ctx.params.areaCode, ctx.params.phone, config.sms.tpl_map.register, [vcode])
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
		fbId: ctx.params.fbId,
		fbName: ctx.params.fbName
	}

	//判断接收的是wx/fb	
	const login_type = ctx.params.type
	switch (login_type) {
		case 'wx':
			user = await services.user.wxLogin(loginParam)
			break;
		case 'fb':
			user = await services.user.fbLogin(loginParam)
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

	let visitIP = ctx.request.ip.replace(/::ffff:/g, '')
	const tokenParams = {
		lg: ctx.params.lg,
		t: ctx.params.terminal,
		visitIP: visitIP,
		uuid: ctx.params.uuid
	}
	const access_token = await services.user.createToken(user_name, tokenParams)
	const key = 'access_token:' + endeurl.md5(user_name)
	user.uuid = ctx.params.uuid
	user.visitIP = visitIP
	user.pppCodes = []
	user.coupons = []
	cache.set(key, JSON.stringify({
		userid,
		user
	}), 'EX', 604800) // 7*24*60*60
	ctx.body = {
		token: access_token
	}
})


router.post('updateUser', async (ctx, next) => {
	const pm = ctx.params
	const user_name = ctx.user.user.userName
	const userQuery = await services.user.userParams(pm)
	const userInfo = await model.user.findOne({
		userName: user_name
	}, {
		_id: -1,
		userName: 1,
		gender: 1,
		name: 1,
		email: 1,
		mobile: 1,
		birthday: 1,
		country: 1
	})
	if (!userInfo) {
		throw {
			status: 10003,
			message: httpStatus.common.system['10003'][ctx.LG],
			router: ctx._url
		}
	}
	await model.user.update({
		userName: user_name
	}, userQuery)

})

module.exports = router