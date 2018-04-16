const Router = require('koa-router')
const router = new Router()
const services = loaddir('services')
let sourceLine = 0.667

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
	let source = await services.face.matchFile(ctx.files.file, ctx.params.faceId)
	fse.unlink(ctx.files.file)

	if (source < sourceLine) {
		throw {
			status: 30101,
			message: httpStatus.common.tip['30101'][ctx.LG],
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
	let featureBuf = await services.face.getFeatureBuf(ctx.files.file)
	fse.unlink(ctx.files.file)

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
			_id: 0,
			faceIds: 1
		}
	}, {
		$unwind: '$faceIds'
	}, {
		$match: {
			_id: {
				$ne: 'noface'
			}
		}
	}])

	const ids = faces.map(face => face.faceIds)
	faces = await services.face.matchFeatureBuf(featureBuf, ids)
	faces = faces.filter(face => face.source > sourceLine).map(face => face.id)

	ctx.body = []
	if (!faces[0]) return

	const photos = await model.photo.find({
		faceIds: {
			$in: faces
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
	const resPhotos = await services.photo.formatPhotos(ctx.params.siteId, photos)
	ctx.body = resPhotos
})

router.post('bindCardsByImage', async(ctx, next) => {
	let featureBuf = await services.face.getFeatureBuf(ctx.files.file)
	fse.unlink(ctx.files.file)

	const dateStr = moment().add(-5, 'days').format('YYYY/MM/DD')
	let faces = await model.face.find({
		active: {
			$gte: new Date(dateStr),
			$lt: new Date()
		}
	}, {
		_id: 1
	})
	const ids = faces.map(face => face._id.toString())
	faces = await services.face.matchFeatureBuf(featureBuf, ids)
	faces = faces.filter(face => face.source > sourceLine).map(face => face.id)

	if (!faces[0]) return
	const groups = await model.photo.aggregate([{
		$match: {
			faceIds: {
				$in: faces
			},
			shootOn: {
				$gte: new Date(dateStr),
				$lt: new Date()
			}
		}
	}, {
		$group: {
			_id: {
				siteId: "$siteId",
				shootOn: {
					$substr: ["$shootOn", 0, 10]
				}
			},
			_ids: {
				$addToSet: '$_id'
			}
		}
	}])

	const cardCodes = await services.face.addFaceCards(groups, faces)
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