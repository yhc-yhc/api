module.exports = {
	getOrdersISpay: {
		method: 'GET',
		desc: "查询订单是否交易成功",
		headers: {},
		params: {
			isPay:[1,'boolean',"订单状态是否交易成功"],
			orderCode:[0,'String',"订单号"]
		},
		resDesc: {}
	}
}