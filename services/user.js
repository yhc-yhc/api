var jwt = require('jsonwebtoken');
const uuid = require('uuid')

exports.createToken = async (user, ctx) => {
	if (!certs.private) {
		await loadCert()
	}
	var token = {
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 604800,
		iss: 'pictureAir',
		uuid: uuid.v1().trim().replace(/-/g, ''),
		visitIP: ctx.request.ip,
		audience: endeurl.md5(user.userName), //md5(user)
		t: 0, //web photo
		appid: '',
		lg: 'en-US'
	}
	return jwt.sign(token, certs.private, {
		algorithm: 'RS512'
	})
}

exports.thirdLogin = async ctx => {
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