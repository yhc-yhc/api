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
		response: face.searchCardsByImage.response,
		resDesc: face.searchCardsByImage.resDesc
	}
}