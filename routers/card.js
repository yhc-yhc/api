const Router = require('koa-router')
const router = new Router()
const services = loaddir('./services')

router.get('listCards', async(ctx, next) => {
	const user = await model.user.findOne({
		_id: ctx.user.userid
	})
	if (!user) {
		throw {
			message: 'user not exists'
		}
	}

	let codes = user.customerIds.map(obj => obj.code)
	codes = codes.concat(user.pppCodes.map(obj => obj.PPPCode))

	const codeBindMap = user.customerIds.reduce((pre, cur) => {
		pre[cur.code] = cur.bindOn
		return pre
	}, {})

	user.pppCodes.reduce((pre, cur) => {
		pre[cur.PPPCode] = cur.bindOn
		return pre
	}, codeBindMap)

	let cards = []
	for (let code of codes) {
		const _cards = services.photo.groupPhotos(code, codeBindMap[code])
		cards = cards.concat(_cards)
	}
	cards.sort((p, c) => {
		return new Date(p.bindOn) - new Date(c.bindOn)
	})
	ctx.body = cards
})

module.exports = router