const Router = require('koa-router')
const router = new Router()
const services = loaddir('./services')

router.post('getFacesOfCard', async(ctx, next) => {
	const dateEnd = moment(new Date(ctx.params.date)).add(1, 'days').format('YYYY/MM/DD')
	const photos = await model.photo.find({
		'customerIds.code': ctx.params.code,
		siteId: ctx.params.siteId,
		shootOn: {
			$gte: new Date(ctx.params.date),
			$lt: new Date(dateEnd)
		}
	}, {
		faceIds: 1
	})
	const faceObj = photos.reduce((pre, cur) => {
		cur.faceIds.reduce((ppre, ccur) => {
			if (ccur != 'noface') {
				ppre[ccur] = ppre[ccur] || 0
				ppre[ccur]++
			}
			return ppre
		}, pre)
		return pre
	}, {})
	const faces = await model.face.find({
		_id: {
			$in: Object.keys(faceObj)
		}
	}, {
		_id: 1,
		url: 1,
		bindInfo: 1
	})
	let cardInfo = ctx.params.siteId + '_' + ctx.params.date + '_' + ctx.params.code
	const faceMap = faces.reduce((pre, cur) => {
		const bind = cur.bindInfo.indexOf(cardInfo) < 0 ? false : true
		pre[cur._id] = {
			url: cur.url,
			bind: bind
		}
		return pre
	}, {})
	let ary = []
	for (let key in faceObj) {
		const obj = {}
		obj._id = key
		obj.url = faceMap[key].url
		obj.bind = faceMap[key].bind
		obj.num = faceObj[key]
		ary.push(obj)
	}
	ary = ary.sort((pre, cur) => cur.num - pre.num)
	ctx.body = ary
})

router.post('bindFaceToCode', async(ctx, next) => {
	const rs = await model.faceBindCard.update({
		faceId: ctx.params.faceId,
		disabled: false
	}, {
		$set: {
			bindDate: new Date(ctx.params.date),
			bindCode: ctx.params.code,
			bindSiteId: ctx.params.siteId
		}
	}, {
		upsert: true
	})
})

router.post('searchPhotosByImage', async(ctx, next) => {
	console.time('SearchFeature: ')
		// let faceAry = await faceai.searchSameFace(ctx.files.file)
	let faceAry = await services.face.searchFeatureFromChlid(ctx.files.file)
	console.timeEnd('SearchFeature: ')
	fse.unlink(ctx.files.file)

	ctx.body = []
	if (!faceAry[0]) return

	console.time('SearchDB: ')
	const faces = await model.face.find({
		name: {
			$in: faceAry
		}
	})
	const ary = faces.map(face => face._id.toString())
	if (!ary[0]) return

	const dateEnd = moment(new Date(ctx.params.date)).add(1, 'days').format('YYYY/MM/DD')
	const photos = await model.photo.find({
		faceIds: {
			$in: ary
		},
		siteId: ctx.params.siteId,
		'customerIds.code': ctx.params.code,
		shootOn: {
			$gte: new Date(ctx.params.date),
			$lt: new Date(dateEnd)
		}
	}, {
		_id: 0,
		thumbnail: 1,
		originalInfo: 1,
		orderHistory: 1
	})
	console.timeEnd('SearchDB: ')
	const resPhotos = await service.photo.formatPhotos(ctx.params.siteId, photos)
	ctx.body = resPhotos
})

router.post('bindCardsByImage', async(ctx, next) => {

	console.time('SearchFeature: ')
	let faceAry = await services.face.searchFeatureFromChlid(ctx.files.file)
	console.timeEnd('SearchFeature: ')
	fse.unlink(ctx.files.file)

	ctx.body = []
	if (!faceAry[0]) return

	console.time('SearchDB: ')
	const faces = await model.face.find({
		name: {
			$in: faceAry
		}
	})
	const ary = faces.map(face => face._id.toString())
	if (!ary[0]) return
	const photos = await model.photo.find({
		faceIds: {
			$in: ary
		},
	}, {
		_id: 1,
		thumbnail: 1,
		original: 1,
		orderHistory: 1,
		siteId: 1,
		'customerIds.code': 1,
		shootOn: 1
	})
	console.timeEnd('SearchDB: ')

	const cardCodes = await services.face.addFaceCards(photos)
	await model.user.update({
		_id: user.user._id
	}, {
		$addToSet: {
			customerIds: {
				$each: cardCodes
			}
		}
	})
})

module.exports = router