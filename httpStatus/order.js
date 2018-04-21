module.exports = {
	getOrdersISpay: {
		method: 'GET',
		desc: "查询订单是否交易成功",
		headers: {
			token: [1, 'String', "标识用户身份"]
		},
		params: {
			isPay:[1,'boolean',"订单状态是否交易成功"]
		},
		resDesc: {}
	}
}