const Router = require('koa-router')
const router = new Router()

router.get('listCards', async(ctx, next) => {
	const user = await model.user.findOne({
		userName: ctx.user.name
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
		const cusCode = photo.customerIds.code.map(obj => obj.code)
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
		let id = ''
		pre[id] = pre[id] || {}
		pre[id].code = cur.code
		pre[id].siteId = cur.siteId
		pre[id].date = cur.date
		pre[id].photos = []
		pre[id]._photos.push({
			url: cur.url
			pay: cur.pay
		})
		pre[id].photoCount = pre[id]._photos.count
		pre[id].photos = pre[id]._photos.map(obj => obj.url)
		pre[id].pay = pre[id]._photos.every(obj => obj.pay)
		pre[id].payCount = pre[id]._photos.some(obj => obj.pay).length

		return pre
	}, {})
	const cards = []
	for (card in codePhotos) {
		const ayr = new Array(2)
		cards.push({
			code: codePhotos[card].code,
			date: codePhotos[card].date,
			siteId: codePhotos[card].siteId,
			photoCount: codePhotos[card].photoCount,
			photos: codePhotos[card].photos.length == 1 ? ary.fill(codePhotos[card].photos[1]) : codePhotos[card].photos.silice(0, 2),
			pay: codePhotos[card].pay,
			payCount: codePhotos[card].payCount,
		})
	}
	ctx.body = cards

})