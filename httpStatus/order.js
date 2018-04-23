module.exports = {
	getOrdersStatus: {
		method: 'GET',
		desc: "查询订单是否交易成功",
		headers: {
			token: [1, 'String', '用户认证id']
		},
		params: {
			isPay: [1, 'boolean', "订单状态是否交易成功"]
		},
		response: {
			"orders": [{
				"orderCode": "1103170331623587",
				"createdOn": "2017-03-31 14:29:08",
				"couponsList": [],
				"orderStatus": 1,
				"totalPrice": 3000,
				"discount": 1000,
				"express": "1",
				"resultPrice": 4000,
				"entity": [],
				"cardUrl": "/sites/RSSG/orderCard.png",
				"virtualProducts": [{
					"productType": 0,
					"count": 1,
					"currency": "JYP",
					"parkName": "LEGOLAND®️ Japan"
				}]
			}]
		}
	}
}