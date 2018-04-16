module.exports = {
	success: {
		status: 200,
		message: 'success',
		result: {
		}
	},
	error: {
		status: 20201,
		message: 'No Face Found',
		result: {
			router: '/face/list',
		}
	},
	errorDes: {
		status: 20502,
		des: {
			2: '服务级错误（1为系统级错误, 2为服务错误，3为用户提示）',
			'05': '服务模块代码',
			'02': '具体错误代码'
		}
	},
	system: {
		10001: {
			'en-US': 'System error',
			'zh-CN': '系统错误'
		},
		10002: {
			'en-US': 'Service unavailable',
			'zh-CN': '服务暂停'
		},
		10003: {
			'en-US': 'Remote service error',
			'zh-CN': '远程服务错误'
		},
		10004: {
			'en-US': 'IP limit',
			'zh-CN': 'IP限制不能请求该资源'
		},
		10005: {
			'en-US': 'Permission denied, need login again',
			'zh-CN': '请重新登录'
		},
		10006: {
			'en-US': 'Miss required parameter, see doc for more info',
			'zh-CN': '缺失必选参数，请参考API文档'
		},
		10007: {
			'en-US': 'Request api not found',
			'zh-CN': '接口不存在'
		},
		10008: {
			'en-US': 'parameter error',
			'zh-CN': '接口参数错误'
		}
	},
	service: {//00 sync, 01 face
		20001: {
			'en-US': 'siteId not exists',
			'zh-CN': 'siteId 不存在'
		},
		20002: {
			'en-US': 'load the image error',
			'zh-CN': '图片读取失败'
		},
		20101: {
			'en-US': 'ID is null',
			'zh-CN': 'ID 参数为空'
		},
		20102: {
			'en-US': 'user not exists',
			'zh-CN': '用户不存在'
		}
	},
	tip: {
		30101: {
			'en-US': 'sorry, face maybe not match',
			'zh-CN': '对不起, 脸不匹配'
		}
	}
}