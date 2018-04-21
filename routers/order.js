const router = new Router()
const services = loaddir('./services')

//1等待买家付款，2买家正在付款，3买家已付款（等待卖家发货），4卖家已发货（等待买家确认），5交易成功，6交易关闭,订单冻结, 7退款中，8退款成功
//3,5都是已完成，其他的都是未完成
router.get('getOrdersISpay', async (ctx, next) => {
	const ispayFlag = ctx.params.isPay
	let payStatus
	if (!ispayFlag) {
		payStatus = [1, 2, 4, 6, 7, 8]
	} else {
		payStatus = [3, 5]
	}
	log('payStatus: '+payStatus)
	const querParam = {
		'orderStatus.status': {
			$in: payStatus
		},
		isDelete: false,
		createdBy:ctx.user.userid
	}
	const orderInfo = await model.order.find(querParam,{},{sort: { _id: -1 }})
	if(!orderInfo){
        throw {
			message: 'orderInfo not exists',
			router:ctx_url
		}
	}
	ctx.body = {orderInfo}

})
module.exports = router