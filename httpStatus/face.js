module.exports = {
	getFacesOfCard: {
		method: 'POST',
		desc: "列出用户所有卡，显示出每张卡下所有的人脸和照片",
		headers: {
			// token: [1, 'String', "标识用户身份"]
		},
		params: {
			code: [1, 'String', "customerIds.code的值"],
			date: [1, 'String', "时间的字符串格式，YYYY/MM/DD"]
		},
		response: [{
			code: 'PACC324YKBWUHD78',
			date: '2018/02/21',
			faces: [{
				_id: '5a9788bfac7cb9001c91fbec',
				url: 'media/924fe72bd415d0c0e3a096d64e26f02bb81c721fe578aa945d28b739fe20b81aafa0a5a1a0198a12dca381648813bc93',
				num: 5
			}]
		}],
		resDesc: {
			code: ['String', "卡号"],
			date: ['Int', "照片日期"],
			faces: ['Araay', "照片包含的人脸数组"],
			'face._id': ['String', '人脸唯一Id'],
			'face.url': ['String', "人脸图片地址"],
			'face.num': ['Number', "人脸在这张卡中出现的次数"]
		}
	},
	bindFaceToCode: {
		method: 'POST',
		desc: "把人脸与卡关联起来",
		headers: {
			token: [1, 'String', "标识用户身份"]
		},
		params: {
			code: [1, 'String', "乐拍通卡号"],
			faceId: [1, 'String', "人脸唯一Id"]
		}
	},
	searchByImage: {
		method: 'POST',
		desc: "传入一张带有人脸的图片，在数据库中检索，返回共享照片中含有此人的图片",
		headers: {
			token: [1, 'String', "标识用户身份"]
		},
		params: {
			file: [1, 'File', "上传的文件名"],
			siteId: [1, 'String', "上传的文件名"],
			date: [1, 'String', "时间的字符串格式，YYYY/MM/DD"],
		},
		response: [{
			cardNo: 'PACC324YKBWUHD78',
			photosCount: 20,
			date: '2018/02/21',
			photos: [{
				_id: '59b62fda0c8da9004ca20c8f',
				x512: 'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
				x1024: 'media/924fe72bd415d0c0e3a096d64e26f02bb81c721fe578aa945d28b739fe20b81aafa0a5a1a0198a12dca381648813bc93',
				url: '',
				pay: false
			}]
		}],
		resDesc: {
			cardNo: ['String', "卡号"],
			photosCount: ['Int', "照片数量"],
			date: ['Int', "照片日期"],
			photos: ['Araay', "照片数据"],
			'photo._id': ['String', '照片唯一Id'],
			'photo.x521': ['String', "512图片地址"],
			'photo.x1024': ['String', "1024图片地址， 如果如果 pay 为 false， 值为水印图地址"],
			'photo.url': ['String', "照片高清图地址，如果 pay 为 false, 值为空"],
			'photo.pay': ['Boolean', "照片是否购买"]
		}
	}
}