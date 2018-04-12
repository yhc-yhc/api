const Router = require('koa-router')
const router = new Router()
const services = loaddir('./services')

router.get('listCards', async(ctx, next) => {
	const user = await model.user.findOne({
		_id: ctx.user.userid
	})
	let codes = user.customerIds.map(obj => obj.code)
	codes = codes.concat(user.pppCodes.map(obj => obj.PPPCode))

	const cards = []
	for (let code of codes) {
		const promise = groupPhotos(code)
		cards.push(promise)
	}
	await Promise.all(cards)
	cards.sort((p, c) => {
		return new Date(p.bindOn) - new Date(c.bindOn)
	})
	ctx.body = cards
})

module.exports = router