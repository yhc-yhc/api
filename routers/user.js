const Router = require('koa-router')
const router = new Router()

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
router.post('wxlogin', async (ctx, next) => {
	const questString = 'access_token=' + ctx.params.access_token + '&' + 'openid=' + ctx.params.openid
	const validateLogin = await request.getAsync({
		url: 'https://api.weixin.qq.com/sns/auth?' + questString
	})
	if (validateLogin.errcoide != 0 && validateLogin.errmsg != 'ok') {
		throw {
			status: 10003,
			message: httpStatus.common.system['10003'][ctx.LG],
			router: ctx.url
		}
	}
	
	const userinfo = await request.getAsync({
		url: 'https://api.weixin.qq.com/sns/userinfo?' + questString
	})
	log('获取微信返回的用户信息：' + userinfo)

	const addressArr = []
	addressArr[0] = ''
	addressArr[1] = userinfo.province
	addressArr[2] = userinfo.city
	addressArr[3] = userinfo.country

	const userdoc = await model.user.update({
		userName: userinfo.nickname
	}, {
		$set: {
			userName: userinfo.nickname,
			name: userinfo.nickname,
			openIds: userinfo.openIds,
			gender: userinfo.sex,
			country: userinfo.country,
			addresses: addressArr,
			coverHeaderImage: userinfo.headimgurl,
			unionid: userinfo.unionid, //用户的unionid是唯一的。换句话说，同一用户，对同一个微信开放平台下的不同应用，unionid是相同的
			registerTerminal: ctx.params.type, //终端类型ios,adriod
			creDatetime:moment().format('YYYY/MM/DD HH:mm:ss'),
			updDatetime:moment().format('YYYY/MM/DD HH:mm:ss'),
		    userPP:"PWUP" + model.user._id.toString().substr(12, 12).toUpperCase()
		}
	}, {
		upsert: true
	})
	cache.set('user', userdoc)
})



module.exports = router