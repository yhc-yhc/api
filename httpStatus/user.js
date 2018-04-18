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
		desc: '第三方登录',
		headers: {},
		params: {
			access_token: [1, 'String', "第三方登录认证的token"],
			openid: [0, 'String', "app认证的openid，授权用户唯一标识,微信为必需"],
			uuid: [1, 'String', "设备的uuid"],
			type: [1, 'String', "wx/fb"],
			terminal: [1, 'String', "ios/adriod,按照之前的0或1传"],
			lg: [1, 'String', 'en/us']
		},
		response: {
			token: '2bd415d0c0e3a096d64e26f'
		},
		resDesc: {
			'token': ['String', '认证标志'],
		}
	}
}