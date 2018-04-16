var jwt = require('jsonwebtoken');
const uuid = require('uuid')

exports.createToken = async (user, ctx_uuid, ctx_ip) => {
	if (!certs.private) {
		await loadCert()
	}
	var token = {
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 604800,
		iss: 'pictureAir',
		uuid: ctx_uuid,
		visitIP: ctx_ip,
		audience: endeurl.md5(user.userName), //md5(user)
		t: 0, //web photo
		appid: '',
		lg: 'en-US'
	}
	return jwt.sign(token, certs.private, {
		algorithm: 'RS512'
	})
}

exports.wxLogin = async ctx => {
	const questString = `access_token=${ctx.params.access_token}&openid=${ctx.params.openid}`
	const loginUrl = `https://api.weixin.qq.com/sns/auth?${questString}`
	const infoUrl = 'https://api.weixin.qq.com/sns/userinfo?' + questString

	const validateLogin = await request.getAsync({
		url: loginUrl
	})
	const isLogin = JSON.parse(validateLogin.body)
	if (isLogin.errcode != 0 && isLogin.errmsg != 'ok') {
		throw {
			status: 10003,
			message: httpStatus.common.system['10003'][ctx.LG],
			router: ctx.url
		}
	}
	const userInfoRes = await request.getAsync({
		url: infoUrl
	})
	if (userInfoRes.statusCode != 200) {
		throw {
			status: 10003,
			message: httpStatus.common.system['10003'][ctx.LG],
			router: ctx.url
		}
	}
	const userInfo = JSON.parse(userInfoRes.body)
	// const addressArr = []
	// addressArr[0] = ''
	// addressArr[1] = userInfo.province
	// addressArr[2] = userInfo.city
	// addressArr[3] = userInfo.country
	const PPCode = "PWUP" + mongoose.Types.ObjectId().toString().substr(12, 12).toUpperCase()
	const user = {
		userName: userInfo.nickname,
		name: userInfo.nickname,
		openIds: userInfo.openid,
		gender: userInfo.sex,
		country: userInfo.country,
		// addresses: addressArr,
		coverHeaderImage: userInfo.headimgurl,
		unionid: userInfo.unionid, //用户的unionid是唯一的。换句话说，同一用户，对同一个微信开放平台下的不同应用，unionid是相同的
		registerTerminal: ctx.params.terminal, //终端类型ios,adriod
		creDatetime: new Date(),
		updDatetime: new Date(),
		userPP: PPCode,
		customerIds: [{
			code: PPCode
		}]
	}
	return user
}

exports.fbLogin = async ctx => {
	const redirect_uri = 'https://dev.pictureair.com/ai/card/listCards'
	const state = (uuid.v4()).replace(/-/g, '')
	const client_id = 'client_id=367593140286059'
	const client_secret = '877e313798a473a6b474a9b7df60fa02'
	log('facebook来了：' + redirect_uri)
	//1.获取code
	const login_query = `client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`
	const login_url = `https://www.facebook.com/v2.12/dialog/oauth?${login_query}`
	const fb_code = await request.getAsync({
		url: login_url
	})
	log('获取返回的code:' + JSON.stringify(fb_code))

	//2.通过code获取access_token
	const token_query = `client_id=${client_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${fb_code.code}`
	const fb_token_url = `https://graph.facebook.com/v2.12/oauth/access_token?${token_query}`
	const fb_token = await request.getAsync({
		url: fb_token_url
	})

	//3.利用token获取用户基本信息

	const user_res = await request.getAsync({
		url: `https://graph.facebook.com/me?${fb_token.access_token}`
	})
	if (!fb_code || !user_res || !fb_token) {
		throw {
			status: 10003,
			message: httpStatus.common.system['10003'][ctx.LG],
			router: ctx.url
		}
	}
	const user_info = JSON.parse(user_res)
	const PPCode = "PWUP" + mongoose.Types.ObjectId().toString().substr(12, 12).toUpperCase()
	const user = {
		userName: user_info.name,
		name: user_info.name,
		openIds: {
			fb: user_info.id
		},
		gender: user_info.gender,
		country: user_info.locale,
		registerTerminal: ctx.params.terminal, //终端类型ios,adriod
		creDatetime: new Date(),
		updDatetime: new Date(),
		userPP: PPCode,
		customerIds: [{
			code: PPCode
		}]
	}
	return user
}