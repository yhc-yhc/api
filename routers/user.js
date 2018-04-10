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


	const questString = 'access_token=' + ctx.request.access_token + '&' + 'openid=' + ctx.request.openid
	log('请求来了：' + questString)
	const validateLogin = await request.getAsync({
		url: 'https://api.weixin.qq.com/sns/auth?' + questString
	})
	console.log('validateLogin: ' + validateLogin)
	if (validateLogin.errcoide == 0 && userInfo.validateLogin == 'ok') {
		/*
	      1.获取到微信返回的用户信息
	   	*/
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
				registerTerminal: ctx.request.type //终端类型ios,adriod

			}
		}, {
			upsert: true
		})
		cache.set('user', userdoc)
		ctx.body = userdoc
	} else {
		ctx.body = 'err,无效的oppen_id／auth_token'
	}

})

module.exports = router