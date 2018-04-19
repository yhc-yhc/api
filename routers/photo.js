const Router = require('koa-router')
const router = new Router()
const services = loaddir('services')
router.get('/', (ctx, next) => {
	ctx.body = 'photo index!';
})

router.get('listPhotos', async (ctx, next) => {
	const query = {
		siteId: ctx.params.siteId,
		shootOn: {
			$gte: new Date(ctx.params.shootDate),
			$lt: new Date(new Date(ctx.params.shootDate).getTime() + 86400000)
		}
	}
	if (ctx.params.code) {
		query['customerIds.code'] = ctx.params.code
	} else {
		const park = await model.park.findOne({
			siteId: ctx.params.siteId
		})
		const code = park.parkCardCode
		query['customerIds.code'] = code
	}
	if (ctx.params.isPaid == 1) {
		query['$or'] = [{
			'orderHistory.0': {
				$exists: true
			}
		}, {
			isFree: true
		}]
	}
	if (ctx.params.isPaid == 0) {
		query['$and'] = [{
			'orderHistory.0': {
				$exists: false
			}
		}, {
			isFree: false
		}]
	}
	if (ctx.params.lastId) {
		query._id = {
			$gt: ctx.params.lastId
		}
	}

	let photos
	if (ctx.params.useLimit) {
		photos = await model.photo.find(query).limit(parseInt(ctx.params.limit) || 50).sort({
			_id: 1
		})
	} else {
		photos = await model.photo.find(query).sort({
			_id: 1
		})
	}
	photos = await services.photo.formatPhotos(ctx.params.siteId, photos)

	ctx.body = {
		photos
	}
})
module.exports = router