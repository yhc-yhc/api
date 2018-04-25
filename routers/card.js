const router = new Router()
const services = loaddir('services')

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

	let groups = []
	for (let code in codeBindMap) {
		const promise = services.photo.groupPhotos(code, codeBindMap[code])
		groups.push(promise)
	}
	groups = await Promise.all(groups)
	let cards = []
	for (ary of groups) {
		cards = cards.concat(ary)
	}
	cards.sort((p, c) => {
		return new Date(c.bindOn) - new Date(p.bindOn)
	})
	ctx.body = cards
})
router.post('batchCreate', async(ctx, next) => {
	let type
	switch (ctx.params.type) {
		case '0':
			type = 'A1'
			break
		default:
			type = 'ER'
	}
	if (type == 'ER') {
		throw {
			message: 'can not service for this type'
		}
	}
	if (ctx.params.remain !== 'pic60ture01air') {
		throw {
			message: 'can not service for you'
		}
	}
	const codes = await services.card.createCardCodes(ctx.params.siteId, type, ctx.params.count, ctx.params.expiredOn)
	const timeStr = moment().format('YYYYMMDDHH:mm:ss')
	const fileName = `./attachments/${ctx.params.siteId}_${type}_${ctx.params.count}_${timeStr}.txt`
	await Promise.all([services.card.createCodeFile(codes, fileName), services.card.saveCodesToDB(codes, type)])
	await services.card.sendFileEmail(fileName)
})
module.exports = router