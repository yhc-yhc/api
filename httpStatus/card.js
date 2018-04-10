const face = require('./face.js')
module.exports = {
	listCards: {
		method: 'GET',
		desc: "显示用户的所有卡",
		headers: {
			token: [1, 'String', "标识用户身份"]
		},
		params: {
			// file: [1, 'Binary', "上传文件的二进制数据"],
		},
		response: [{
			code: 'PACC324YKBWUHD78',
			bindOn: '2018.02.21',
			siteId: 'JPGF',
			parkName: 'JPGF',
			ocrCard: false,
			faceCard: false,
			type: 0,
			pageUrl: 'http://sky100.com.hk/',
			shareLink: 'http://sky100.com.hk/',
			bgUrl: 'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
			barUrl: 'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
			photosCount: 20,
			allowPay: false,
			payCount: 5,
			photos: [
				'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd',
				'media/924fe72bd415d0c0e3a096d64e26f02b292eb760642e00b70744f72df9e43494698c7b91e0afb079ae4208e75ac96bcd'
			]
		}],
		resDesc: {
			code: ['String', "卡号"],
			bindOn: ['String', "照片日期格式为 YYYY.MM.DD"],
			siteId: ['String', "乐园的siteId"],
			parkName: ['String', "乐园名称"],
			ocrCard: ['Boolean', "是否支持ocr搜索"],
			faceCard: ['Boolean', "是否支持人脸搜索"],
			type: ['Int', "0/1, 0为个人卡，1为共享卡"],
			pageUrl: ['String', "点击跳转的活动详情页地址"],
			shareLink: ['String', "卡分享的地址"],
			bgUrl: ['String', "卡的封面url"],
			barUrl: ['String', "bgUrl点击后的图片url"],
			photosCount: ['Int', "照片数量"],
			allowPay: ['Boolean', "卡是否可以购买, 如果卡内所有照片都买了，值为false"],
			payCount: ['Int', "卡内购买的照片数量"],
			photos: ['Araay', "只显示两张照片的x512地址数据， 如果只有一张，就重复两次"],
		}
	}
}