module.exports = {
	sendSms: {
		method: 'POST',
		desc: "向指定的手机号码发送短信",
		headers: {},
		params: {},
		resDesc: {}
	},
	thirdLogin: {
        method: 'POST',
        desc: '微信登录app并获取用户信息',
        headers: {
			// token: [1, 'String', "标识用户身份"]
		},
		params: {
			access_token: [1, 'String', "微信登录认证的token"],
			openid: [1, 'String', "app认证的openid，授权用户唯一标识"],
			type:[1, 'String', "wx/fb"],
			terminal:[1, 'String', "ios/adriod"]
		},
		resDesc:{
			'token': ['String', '认证标志'],
		}
    }
}