const Router = require('koa-router')
const router = new Router()

router.get('listCards', async(ctx, next) => {
	const user = await model.user.findOne({
		_id: ctx.user.userid
	})
	const codes = user.customerIds.map(obj => obj.code)
	const photos = await model.photo.find({
		'customerIds.code': {
			$in: codes
		}
	}, {
		_id: 0,
		thumbnail: 1,
		original: 1,
		orderHistory: 1,
		siteId: 1,
		'customerIds.code': 1,
		shootOn: 1
	})
	const cards = await services.photo.photosToCards(photos)
	ctx.body = cards
})

module.exports = router