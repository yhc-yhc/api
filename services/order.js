function getOrderStatus(status) {
	switch (true) {
		case /[1]/.test(status):
			return 1 //未付款
			break
		case /[2,7,10]/.test(status):
			return 2 //处理中
			break
		case /[3,5]/.test(status):
			return 3 //已完成
			break
		case /[6]/.test(status):
			return 4 //已取消
			break
		case /[8]/.test(status):
			return 5 //已退款
			break
		case /[9]/.test(status):
			return 6 //交易失败
			break
	}
}
exports.orderFomat = (order, park) => {
	const obj = {}
	obj.orderCode = order.orderCode
	obj.transCode = order.transCode
	obj.createdOn = order.createdOn
	obj.couponsList = order.couponsList
	obj.orderStatus = getOrderStatus(order.orderStatus.status)
	obj.totalPrice = order.orderProducts.resume.totalPrice.toString()
	obj.currency = order.currency
	obj.discount = order.orderProducts.resume.preferentialPrice.toString()
	obj.express = order.orderProducts.resume.express.toString()
	obj.resultPrice = order.orderProducts.resume.resultPrice.toString()
	//obj.orderProducts = new FilterOrderProductsToRes(order.orderProducts, park)
	obj.entity = order.orderProducts.entity
	obj.cardUrl = park.cardUrl //'/sites/common/orderCard.png'
	obj.virtualProducts = []
	for (let item of order.orderProducts.virtualProducts) {
		obj.virtualProducts.push({
			productType: item.productType,
			count: item.count,
			currency: park.currency || '',
			parkName: park.name || ''
		})

	}
	return obj
}