const Router = require('koa-router')
const router = new Router()
const services = loaddir('./services')

router.post('syncToCloud', async(ctx, next) => {
	const customerCodes = ctx.params.photo.customerIds.map(obj => obj.code)
		//update orderHistory
	const cards = await model.cardCode.find({
		PPCode: {
			$in: customerCodes
		},
		active: true,
		expiredOn: {
			$gte: new Date(ctx.params.photo.shootOn)
		}
	})
	const newOrderHistory = cards.map(card => {
		return {
			userId: card.userId,
			customerId: card.PPCode,
			productId: card.oType
		}
	})
	ctx.params.photo.orderHistory ? '' : ctx.params.photo.orderHistory = []
	ctx.params.photo.orderHistory = ctx.params.photo.orderHistory.concat(newOrderHistory)
		//update file url
	const bucketName = `pa${process.env.RUN == 'product' ? '': 'testenv'}oss`
	const siteId = ctx.params.photo.siteId
	const shootOn = new Date(ctx.params.photo.shootOn)
	const dayStr = moment(shootOn.getTime()).format('YYYYMMDD')
	const _x1024 = endeurl.md5(`tn${ctx.params.photo._id}`)
	const _url = endeurl.md5(`hd${ctx.params.photo._id}`)
	const _w1024 = endeurl.md5(`wm${ctx.params.photo._id}`)
	const promises = [
		services.photo.saveToOSS(bucketName, `oss/${siteId}/${dayStr}/photos/tn/${_x1024}.jpg`, new Buffer(ctx.params.L, 'base64')),
		services.photo.saveToOSS(bucketName, `oss/${siteId}/${dayStr}/photos/hd/${_url}.jpg`, new Buffer(ctx.params.O, 'base64')),
		services.photo.saveToOSS(bucketName, `oss/${siteId}/${dayStr}/photos/wm/${_w1024}.jpg`, new Buffer(ctx.params.W1024, 'base64'))
	]
	const [x1024, url, w1024] = await Promise.all(promises)
	ctx.params.photo.thumbnail.x1024.url = x1024
	ctx.params.photo.thumbnail.x1024.path = x1024
	ctx.params.photo.originalInfo.url = url
	ctx.params.photo.originalInfo.path = url
	ctx.params.photo.thumbnail.w1024.url = w1024
	ctx.params.photo.thumbnail.w1024.path = w1024
	ctx.params.photo.thumbnail.x512.url = x1024
	ctx.params.photo.thumbnail.x512.path = x1024
	ctx.params.photo.thumbnail.x128.url = x1024
	ctx.params.photo.thumbnail.x128.path = x1024
	delete ctx.params.photo.__v
	await model.photo.update({
		_id: ctx.params.photo._id
	}, {
		$set: ctx.params.photo
	}, {
		upsert: true
	})
})

router.post('syncOrder', async(ctx, next) => {
	if (ctx.params.order._id || ctx.params.order.siteId) {
		throw {
			status: 10008,
			message: httpStatus.common.system['10008'][ctx.LG],
			router: ctx.url
		}
	}
	const park = await model.park.findOne({
		siteId: ctx.params.order.siteId
	})
	if (!park) {
		throw {
			status: 20001,
			message: httpStatus.common.system['20001'][ctx.LG],
			router: ctx.url
		}
	}
	ctx.params.order.currency = park.currency
	ctx.params.order.orderStatus = {
		status: 5,
		remark: '线下支付订单'
	}
	const obj = {
		entity: [],
		virtualProducts: [],
		resume: {
			express: ctx.params.order.orderProducts.resume.express,
			totalPrice: ctx.params.order.orderProducts.resume.totalPrice,
			totalCount: ctx.params.order.orderProducts.resume.totalCount,
			straightwayPreferentialPrice: ctx.params.order.orderProducts.resume.straightwayPreferentialPrice,
			promotionPreferentialPrice: ctx.params.order.orderProducts.resume.promotionPreferentialPrice,
			resultPrice: ctx.params.order.orderProducts.resume.resultPrice,
			preferentialPrice: ctx.params.order.orderProducts.resume.preferentialPrice,
			currency: ctx.params.order.currency
		}
	}
	for (let i in ctx.params.order.orderProducts.items) {
		let pro = ctx.params.order.orderProducts.items[i];
		if (pro.productEntityType) {
			obj.entity.push(pro);
		} else {
			obj.virtualProducts.push()
		}
	}
	ctx.params.order.orderProducts = obj
	delete ctx.params.order.__v
	await model.order.update({
		orderCode: ctx.params.order.orderCode
	}, {
		$set: ctx.params.order
	}, {
		upsert: true
	})
})

router.post('syncScanPPHistory', async(ctx, next) => {
	if (ctx.params.syncScanPPHistory._id || ctx.params.syncScanPPHistory.PPCode) {
		throw {
			status: 10008,
			message: httpStatus.common.system['10008'][ctx.LG],
			router: ctx.url
		}
	}
	delete ctx.params.syncScanPPHistory.__v
	await model.scanPPHistory.update({
		PPCode: ctx.params.syncScanPPHistory.PPCode
	}, {
		$set: ctx.params.syncScanPPHistory
	}, {
		upsert: true
	})
})

module.exports = router