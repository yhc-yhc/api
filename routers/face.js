const Router = require('koa-router')
const router = new Router()
const services = loaddir('services')

router.post('getFacesOfCard', async(ctx, next) => {
	const dateEnd = moment(new Date(ctx.params.date)).add(1, 'days').format('YYYY/MM/DD')
	let faces = await model.photo.aggregate([{
		$match: {
			siteId: ctx.params.siteId,
			'customerIds.code': ctx.params.code,
			shootOn: {
				$gte: new Date(ctx.params.date),
				$lt: new Date(dateEnd)
			}
		}
	}, {
		$project: {
			faceIds: 1
		}
	}, {
		$unwind: '$faceIds'
	}, {
		$group: {
			_id: '$faceIds',
			num: {
				$sum: 1
			}
		}
	}, {
		$match: {
			_id: {
				$ne: 'noface'
			}
		}
	}, {
		$sort: {
			num: -1
		}
	}])

	const promises = []
	for (let face of faces) {
		let promise = services.face.getFaceInfo(face, ctx.params.date, ctx.params.siteId, ctx.params.code)
		promises.push(promise)
	}
	faces = await Promise.all(promises)
	ctx.body = faces
})

router.post('bindFaceToCode', async(ctx, next) => {
	let source = await services.face.matchFeatureFromChlid(ctx.files.file, ctx.params.faceId)
	if (source < 0.77) {
		throw {
			status: 30101,
			message: httpStatus.common.system['30101'][ctx.LG],
			router: ctx.url
		}
	}
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
	const resPhotos = await services.photo.formatPhotos(ctx.params.siteId, photos)
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