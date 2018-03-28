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
	const codePhotos = []
	photos.forEach(photo => {
		const cusCode = photo.customerIds.map(obj => obj.code)
		const _codes = []
		for (let code of cusCode) {
			if (codes.indexOf(code) == -1) {
				_codes.push(code)
			}
		}
		for (let code of _codes) {
			codePhotos.push({
				code: code,
				date: moment(new Date(photo.shootOn)).format('YYYY.MM.DD'),
				siteId: photo.siteId,
				url: photo.thumbnail.x512.url,
				pay: photo.orderHistory[0] ? true : false
			})
		}
	})
	codePhotos.reduce((pre, cur) => {
		let id = `${cur.code}__${cur.siteId}__${cur.date}`
		pre[id] = pre[id] || {}
		pre[id].code = cur.code
		pre[id].siteId = cur.siteId
		pre[id].date = cur.date
		pre[id]._photos = pre[id]._photos || []
		pre[id]._photos.push({
			url: cur.url,
			pay: cur.pay
		})
		return pre
	}, {})
	const cards = []
	for (card in codePhotos) {
		const ayr = new Array(2)
		const photos = codePhotos[card]._photos.map(obj => obj.url)
		const pay = codePhotos[card]._photos.every(obj => obj.pay)
		const payCount = codePhotos[card]._photos.some(obj => obj.pay).length
		cards.push({
			code: codePhotos[card].code,
			date: codePhotos[card].date,
			siteId: codePhotos[card].siteId,
			photoCount: codePhotos[card]._photos.length,
			photos: codePhotos[card]._photos.length == 1 ? ary.fill(photos[0]) : photos.silice(0, 2),
			pay: pay,
			payCount: payCount,
		})
	}
	ctx.body = cards
})

module.exports = router