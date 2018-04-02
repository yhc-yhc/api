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
		response: {
			"coverHeaderImage": {
				"lg": "/sites/SIHK/BG_V.jpg",
				"xs": "/sites/SIHK/BG_H.jpg"
			},
			"logoUrl": "/new_sites/SIHK/logo.png",
			"photos": [{
				"_id": "59709dc01ee822140e00030e",
				"siteId": "SIHK",
				"locationId": "ev1",
				"shootOn": "2017-07-20 20:10:28",
				"isFree": true,
				"isPaid": true,
				"parkName": "Sky100",
				"mimeType": 'jpg',
				"wMP4": {},
				"thumbnail": {
					"x512": {
						"url": "media/33267e46b01d333ada075909980910005b066ab8b7b7cf1744f2b212a0bcb132bcae1664877d2b63a48cab05d5bf2adacc87c9920b89d8d59d5e16a9b484cbcecbb56ad74d1c1f382dea61c903dc2f7f1103902f115f6ae5cfce045e702d84ef",
						"width": 512,
						"height": 384
					},
					"x1024": {
						"url": "media/33267e46b01d333ada07590998091000c4635390d67d12da7a3d4035f9039298f6fc9a073ed406900047af75e3a159558c40f801455f1e820251714de64de3a48205883db8703081fc06ed30624bde7f",
						"width": 1024,
						"height": 768
					}
				},
				"originalInfo": {
					"url": "media/33267e46b01d333ada07590998091000f5c82f1943241cea7ceb384a540af410b5fec380620bcdb95c43fda7fa65a0d9b4d831b064d79abe03758913c182f96eb741ea812bcd30fe45a1872c0ea9fab7",
					"height": 3450,
					"width": 4600,
					"originalName": "ev1_ev1-6EBE-00745446-200924-72615365_GS3.JPG"
				}
			}]
		},
		resDesc: {
			'coverHeaderImage.lg': ['String', 'web显示使用'],
			'coverHeaderImage.xs': ['String', 'web显示使用'],
			logoUrl: ['String', 'web显示使用'],
			photos: ['Array', '照片对象数组'], 
		}
	},
	bindCardsByImage: {
		method: 'POST',
		desc: "传入一张带有人脸的图片，在数据库中检索，返回共享照片中含有此人的卡",
		headers: {
			// token: [1, 'String', "标识用户身份"]
		},
		params: {
			file: [1, 'Binary', "上传文件的二进制数据"],
		}
	}
}