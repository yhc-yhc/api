module.exports = {
	getFacesOfCard: {
		method: 'POST',
		desc: "列出用户所有卡，显示出每张卡下所有的人脸和照片",
		headers: {
			// token: [1, 'String', "标识用户身份"]
		},
		params: {
			siteId: [1, 'String', "siteId的值"],
			code: [1, 'String', "customerIds.code的值"],
			date: [1, 'String', "时间的字符串格式，YYYY/MM/DD"]
		},
		response: [{
			_id: '5aab66b2c6b63a001e2bef6d',
			url: 'media/ec46cf015df568b60374639244c23b62cfe86792e5b36469f32d9e5b7aa19dbaa15a3060ed3c059d20dc10236216fc514d2c20ee13ec84931f999ef56e6b4901802ea80ed62707768d65b415e9e7c94b2c4424683533f52eb50d1a8c93078cc84843c96332668bec1f4a2d6b7f84bd8c',
			num: 11,
			bind: false
		}, {
			_id: '5aab66b2c6b63a001e2bef6e',
			url: 'media/ec46cf015df568b60374639244c23b62cfe86792e5b36469f32d9e5b7aa19dbaa15a3060ed3c059d20dc10236216fc514d2c20ee13ec84931f999ef56e6b4901802ea80ed62707768d65b415e9e7c94b08f09c911567b8dedf79fff7085876955a4f2357b8d648861a402041086d9978',
			num: 3,
			bind: false
		}],
		resDesc: {
			'_id': ['String', '人脸唯一Id'],
			'url': ['String', "人脸图片地址"],
			'num': ['Number', "人脸在这张卡中出现的次数"],
			'bind': ['Boolean', "人脸是否被这张卡绑定"]
		}
	},
	bindFaceToCode: {
		method: 'POST',
		desc: "把人脸与卡关联起来",
		headers: {
			// token: [1, 'String', "标识用户身份"]
		},
		params: {
			siteId: [1, 'String', "siteId的值"],
			code: [1, 'String', "乐拍通卡号"],
			date: [1, 'String', "时间的字符串格式，YYYY/MM/DD"],
			faceId: [1, 'String', "人脸唯一Id"]
		}
	},
	searchPhotosByImage: {
		method: 'POST',
		desc: "传入一张带有人脸的图片，在数据库中检索，返回共享照片中含有此人的图片",
		headers: {
			// token: [1, 'String', "标识用户身份"]
		},
		params: {
			file: [1, 'Binary', "上传文件的二进制数据"],
			siteId: [1, 'String', "乐园的siteId"],
			code: [1, 'String', "customerIds.code的值"],
			date: [1, 'String', "时间的字符串格式，YYYY/MM/DD"],
		},
		response: [{
			_id: '59b62fda0c8da9004ca20c8f',
			x512: 'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
			x1024: 'media/924fe72bd415d0c0e3a096d64e26f02bb81c721fe578aa945d28b739fe20b81aafa0a5a1a0198a12dca381648813bc93',
			url: '',
			pay: false
		}, {
			_id: '59b62fda0c8da9004ca20c8f',
			x512: 'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
			x1024: 'media/924fe72bd415d0c0e3a096d64e26f02bb81c721fe578aa945d28b739fe20b81aafa0a5a1a0198a12dca381648813bc93',
			url: '',
			pay: false
		}],
		resDesc: {
			_id: ['String', '照片唯一Id'],
			x521: ['String', "512图片地址"],
			x1024: ['String', "1024图片地址， 如果如果 pay 为 false， 值为水印图地址"],
			url: ['String', "照片高清图地址，如果 pay 为 false, 值为空"],
			pay: ['Boolean', "照片是否购买"]
		}
	},
	searchCardsByImage: {
		method: 'POST',
		desc: "传入一张带有人脸的图片，在数据库中检索，返回共享照片中含有此人的卡",
		headers: {
			// token: [1, 'String', "标识用户身份"]
		},
		params: {
			file: [1, 'Binary', "上传文件的二进制数据"],
		},
		response: [{
			code: 'PACC324YKBWUHD78',
			date: '2018.02.21',
			siteId: 'JPGF',
			parkName: 'JPGF',
			cardImage: 'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
			photosCount: 20,
			pay: false,
			payCount: 5,
			photos: [
				'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
				'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd'
			]
		}],
		resDesc: {
			code: ['String', "卡号"],
			date: ['String', "照片日期格式为 YYYY.MM.DD"],
			siteId: ['String', "乐园的siteId"],
			parkName: ['String', "乐园名称"],
			cardImage: ['String', "卡的封面url"],
			photosCount: ['Int', "照片数量"],
			pay: ['Boolean', "卡是否购买"],
			payCount: ['Int', "卡内购买的照片数量"],
			photos: ['Araay', "只显示两张照片的x512地址数据， 如果只有一张，就重复两次"],
		}
	}
}