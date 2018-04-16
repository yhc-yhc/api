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
	const codeBindMap = user.customerIds.reduce((pre, cur) => {
		if (cur.code.slice(0, 2) == 'PW') return pre
		pre[cur.code] = cur.bindOn
		return pre
	}, {})

	user.pppCodes.filter(obj => obj.PPCode).reduce((pre, cur) => {
		if (cur.PPCode.slice(0, 2) == 'PW') return pre
		pre[cur.PPCode] = cur.bindOn
		return pre
	}, codeBindMap)

	let groupPromises = []
	for (let code in codeBindMap) {
		const promise = services.photo.groupPhotos(code, codeBindMap[code])
		groupPromises.push(promise)
	}
	await Promise.all(groupPromises)
	let cards = []
	for (ary of groupPromises) {
		cards = cards.concat(await ary)
	}
	cards.sort((p, c) => {
		return new Date(c.bindOn) - new Date(p.bindOn)
	})
	ctx.body = cards
})

module.exports = router