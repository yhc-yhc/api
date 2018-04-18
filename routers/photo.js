const Router = require('koa-router')
const router = new Router()
router.get('/', (ctx, next) => {
	ctx.body = 'photo index!';
})

router.get('listPhotos', async (ctx, next) => {

	let query
	if (!ctx.params.code && !ctx.params.shootDate) {
		// find the park of siteId 

		// get the pakr code


	} else {
		query = {
			siteId: ctx.params.siteId,
			code: ctx.params.code,
			shootDate: {
				$gte: new Date(ctx.params.shootDate),
				$lt: new Date(new Date(ctx.params.shootDate).getTime() + 76800000)
			}
			// isPaid: ctx.params.isPaid ? -1 : ctx.params.siteId,
			// lteId: ctx.params.lteId
		}
	}

	const queryParam = {
		siteId: ctx.params.siteId,
		code: ctx.params.code,
		// shootDate: ctx.params.shootDate,
		// isPaid: ctx.params.isPaid ? -1 : ctx.params.siteId,
		// lteId: ctx.params.lteId
	}
	let phtoto
	if (ctx.params.useLimit) {
		phtotos = await model.photo.find(queryParam).limit(ctx.params.limit || 50)
	} else {
		phtotos = await model.photo.find(queryParam)
	}

	ctx.body = phtotos


})
module.exports = router