const router = new Router()
const services = loaddir('./services')

//1等待买家付款，2买家正在付款，3买家已付款（等待卖家发货），4卖家已发货（等待买家确认），5交易成功，6交易关闭,订单冻结, 7退款中，8退款成功
//3,5都是已完成，其他的都是未完成
router.get('listOrders', async (ctx, next) => {
	let payStatus = [3, 5]
	const querParam = {
		isDelete: false,
		createdBy: ctx.user.userid
	}
	if (ctx.params.isPay == 'true') {
		querParam['orderStatus.status'] = {
			$in: payStatus
		}
	} else {
		querParam['orderStatus.status'] = {
			$nin: payStatus
		}
	}
	const orderInfo = await model.order.find(querParam).sort({
		_id: -1
	})
	let orders = []
	if (!orderInfo.length) {
		ctx.body = {
			orders
		}
		return
	}
	const siteId = orderInfo.map(order => order.siteId)
	const park = await model.park.find({
		siteId: {
			$in: siteId
		}
	})
	const parkMap = park.reduce((pre, cur) => {
		pre[cur.siteId] = cur
		return pre
	}, {})
	for (let order of orderInfo) {
		orders.push(services.order.orderFomat(order, parkMap[order.siteId]))
	}
	ctx.body = {
		orders
	}
})
module.exports = router