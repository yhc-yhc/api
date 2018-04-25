const jwt = require('jsonwebtoken');
const uuid = require('uuid')

exports.createToken = async (userName, params) => {
	if (!certs.private) {
		await loadCert()
	}
	var token = {
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 604800,
		iss: 'pictureAir',
		uuid: params.uuid,
		visitIP: params.visitIP,
		audience: endeurl.md5(userName), //md5(user)
		t: params.t, //web photo
		appid: '',
		lg: params.lg
	}
	return jwt.sign(token, certs.private, {
		algorithm: 'RS512'
	})
}
async function resUser(uName) {

	const r_user = await model.user.findOne({
		userName: uName
	}, {
		mobile: 1,
		email: 1,
		gender: 1,
		birthday: 1,
		address: 1,
		favoriteLocationIds: 1,
		hiddenPPList: 1,
		favoritePhotos: 1,
		hiddenPPList: 1,
		favoritePhotos: 1,
		likePhotos: 1,
		emailVerified: 1,
		disabled: 1,
		disablereason: 1,
		userLink: 1
	})
	return r_user ? r_user : ''
}

function toUserJson(res_user) {
	const PPCode = "PWUP" + mongoose.Types.ObjectId().toString().substr(12, 12).toUpperCase()
	const jsonObj = {
        creDatetime: new Date(),
		updDatetime: new Date(),
		userPP: PPCode,
		customerIds: [{
			code: PPCode
		}],
		userType: 'user',
		mobile: res_user.mobile || '',
		email: res_user.email || '',
		country: res_user.country || '',
		gender: res_user.gender || -1,
		birthday: res_user.birthday || '',
		address: res_user.address && res_user.address.length > 0 ? res_user.address : [],
		coverHeaderImage: res_user.coverHeaderImage || '',
		favoriteLocationIds: res_user.favoriteLocationIds && res_user.favoriteLocationIds.length > 0 ? res_user.favoriteLocationIds : [],
		qq: '',
		hiddenPPList: res_user.hiddenPPList && res_user.hiddenPPList.length > 0 ? res_user.hiddenPPList : [],
		favoritePhotos: res_user.favoritePhotos && res_user.favoritePhotos.length > 0 ? res_user.favoritePhotos : [],
		likePhotos: res_user.likePhotos && res_user.likePhotos.length > 0 ? res_user.likePhotos : [],
		emailVerified: false,
		disabled: false,
		disablereason: '',
		customerIdsLen: 12,
		lgcode: 'en-US',
		photosNum: res_user.photosNum || 0,
		userLink: res_user.userLink || ''
	}
	return jsonObj

}
exports.wxLogin = async loginparams => {


	const questString = `access_token=${loginparams.token}&openid=${loginparams.openid}`
	const loginUrl = `https://api.weixin.qq.com/sns/auth?${questString}`
	const infoUrl = `https://api.weixin.qq.com/sns/userinfo?${questString}`

	const validateLogin = await request.getAsync({
		url: loginUrl
	})
	const isLogin = JSON.parse(validateLogin.body)
	if (isLogin.errcode != 0 && isLogin.errmsg != 'ok') {
		throw {
			status: 10003,
			message: httpStatus.common.system['10003'][loginparams.LG],
			router: loginparams._url
		}
	}
	const userInfoRes = await request.getAsync({
		url: infoUrl
	})
	if (userInfoRes.statusCode != 200) {
		throw {
			status: 10003,
			message: httpStatus.common.system['10003'][loginparams.LG],
			router: loginparams._url
		}
	}
	const userInfo = JSON.parse(userInfoRes.body)
	const res_user = await resUser(userInfo.nickname)
	const userExtraParam = toUserJson(res_user)
	const user = {
		userName: userInfo.nickname,
		name: userInfo.nickname,
		openIds: {
			wx: userInfo.openid
		},
		gender: userInfo.sex,
		unionid: userInfo.unionid, //用户的unionid是唯一的。换句话说，同一用户，对同一个微信开放平台下的不同应用，unionid是相同的
		registerTerminal: loginparams.terminal //终端类型ios,adriod
		
	}

	for(let info in userExtraParam){
		user[info] = userExtraParam[info]
	}
	return user
}

exports.fbLogin = async loginparams => {
	const id = loginparams.fbId
	const fbUserName = loginparams.fbName
	const res_user = await resUser(fbUserName)
	const userExtraParam = toUserJson(res_user)
	const user = {
		userName: fbUserName,
		name: fbUserName,
		openIds: {
			fb: id
		},
		gender: res_user.gender || -1,
		registerTerminal: loginparams.terminal //终端类型ios,adriod
	}
	for(let info in userExtraParam){
		user[info] = userExtraParam[info]
	}
	return user
}


exports.sendSMS = async (areaCode, mobile, tplMap, contentAry) => {
	let random = parseInt(Math.random() * 10000000000)
	let time = parseInt(Date.now() / 1000)
	let presign = `appkey=${config.sms.appkey}&random=${random}&time=${time}&mobile=${mobile}`
	let sig = crypto.createHash('sha256').update(presign, 'utf-8').digest('hex')
	// log(config.sms.tpl_sign, areaCode, config.sms.tpl_sign[areaCode], tplMap)
	const body = {
		tel: {
			nationcode: areaCode,
			mobile: mobile
		},
		sign: config.sms.tpl_sign[areaCode] || config.sms.tpl_sign.orthers,
		tpl_id: tplMap[areaCode] || tplMap.orthers,
		params: contentAry,
		sig: sig,
		time: time,
		extend: '',
		ext: ''
	}
	// log(body)
	return await request.postAsync({
		url: `${config.sms.url}?sdkappid=${config.sms.sdkappid}&random=${random}`,
		body: body,
		json: true
	})
}

exports.userParams = async pm => {
	//1.接收前端传过来的参数
	let user = {}

	if (pm.name && pm.name.trim() != '') {
		user.name = pm.name
	}
	if (pm.gender && pm.gender.trim() != '') {
		user.gender = pm.gender
	}

	const regEmail = /^\s*\w+(?:\.{0,1}[\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*$/
	if (pm.email && pm.email.trim() != '') {
		if (!regEmail.exec(pm.email.trim())) {
			throw {
				status: 10003,
				message: '邮件格式错误！'
			}
		}
		user.email = pm.email

	}

	const regMP = /^[1][3,4,5,7,8][0-9]{9}$/
	if (pm.mobile && pm.mobile.trim() != '') {
		if (!regMP.test(pm.mobile.trim())) {
			throw {
				status: 10003,
				message: '手机号码不合法！'
			}

		}
		user.mobile = pm.mobile
	}

	if (pm.birthday && pm.birthday.trim()) {
		user.birthday = pm.birthday
	}

	if (pm.country && pm.country.trim() != '') {
		user.country = pm.country
	}
	return user

}