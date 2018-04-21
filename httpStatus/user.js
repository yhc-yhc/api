module.exports = {
	sendSMS: {
		method: 'POST',
		desc: "向指定的手机号码发送短信",
		headers: {},
		params: {
			areaCode: [1, 'String', "区号,如+86"],
			phone: [1, 'String', "手机号码"]
		},
		resDesc: {}
	},
	thirdLogin: {
		method: 'POST',
		desc: '第三方登录',
		headers: {},
		params: {
			access_token: [0, 'String', "微信登录必传"],
			openid: [0, 'String', "app认证的openid，授权用户唯一标识,微信为必需"],
			uuid: [1, 'String', "设备的uuid"],
			type: [1, 'String', "wx/fb"],
			terminal: [1, 'String', "ios/adriod,按照之前的0或1传"],
			lg: [1, 'String', 'en/us'],
			fbId: [0, 'String', "为facebook获取的用户id时，必传"],
			fbName: [0, 'String', "为facebook获取的用户name时，必传"]
		},
		response: {
			token: '2bd415d0c0e3a096d64e26f'
		},
		resDesc: {
			'token': ['String', '认证标志']
		}
	},
	updateUser: {
		method: 'POST',
		desc: '更新用户信息',
		headers: {},
		params: {
			userName: [1, 'String', "用户名字/昵称"],
			name: [0, 'String', "用户名字/昵称"],
			gender: [0, 'String', "-1 未知 0 女 1 男"],
			email: [0, 'String', "邮箱,如果传了，邮箱格式必需正确"],
			mobile: [0, 'String', "手机号,如果传了，格式必需正确"],
			birthday: [0, 'String', "生日,年月日"],
			country: [0, 'String', "国家"]
		},
		response: {},
		resDesc: {}
	}
}