const router = new Router()
const services = loaddir('services')
const uuid = require('uuid')
const archiver = require('archiver')
const fs = require('fs')
const send = require('koa-send')

const oss = require('ali-oss').Wrapper
const store = oss({
	accessKeyId: 'LTAIamKqehuCllfX',
	accessKeySecret: '6sr2fdtUJHQK1GaKJdjY1JDNg94YrM',
	region: 'oss-cn-shanghai',
	timeout: 120000
})
store.useBucket('patestoss')

router.get('listPhotos', async (ctx, next) => {
	const query = {
		siteId: ctx.params.siteId,
		shootOn: {
			$gte: new Date(ctx.params.shootDate),
			$lt: new Date(new Date(ctx.params.shootDate).getTime() + 86400000)
		}
	}
	//个人照片永远没有共享
	if (ctx.params.code) {
		query['customerIds.code'] = ctx.params.code
	} else {
		const park = await model.park.findOne({
			siteId: ctx.params.siteId
		})
		const code = park.parkCardCode
		query['customerIds.code'] = code
	}
	if (ctx.params.isPaid == 1) {
		query['orderHistory.0'] = {
			$exists: true
		}
	}
	if (ctx.params.isPaid == 0) {
		query['orderHistory.0'] = {
			$exists: false
		}
	}
	if (ctx.params.lastId) {
		query._id = {
			$gt: ctx.params.lastId
		}
	}

	let photos
	if (ctx.params.useLimit) {
		photos = await model.photo.find(query).limit(parseInt(ctx.params.limit) || 50).sort({
			_id: 1
		})
	} else {
		photos = await model.photo.find(query).sort({
			_id: 1
		})
	}
	photos = await services.photo.formatPhotos(ctx.params.siteId, photos)

	ctx.body = {
		photos
	}
})

router.post('predown', async (ctx, next) => {
	const userInfo = ctx.user.user
	var photoIdsParam = ctx.params.photoIds
	log(60, photoIdsParam)
	if (photoIdsParam.indexOf(",") != 0) {
		photoIdsParam = photoIdsParam.split(',')
	}
	const photoIdIndex = uuid.v4().replace(/-/g, '')
	cache.set(photoIdIndex, JSON.stringify({
		photoIds: photoIdsParam,
		userId: ctx.user.userid,
		userName: userInfo.userName
	}), 'EX', 600 * 5)
	ctx.body = {
		key: photoIdIndex
	}
})

router.get('down', async (ctx, next) => {
	const photoKey = await cache.getAsync(ctx.params.key)
	if (!photoKey) {
		throw {
			message: 'file not exists',
			router: ctx._url
		}
	}
	const photoObj = JSON.parse(photoKey)
	const photoIds = photoObj.photoIds

	const photoInfo = await model.photo.find({
		_id: {
			$in: photoIds
		}
	}, {
		_id: 0,
		'originalInfo.path': 1
	})
	if (!photoInfo) {
		throw {
			message: 'photo not exists',
			router: ctx._url
		}
	}
  
	const zipath = `${uuid.v4().replace(/-/g, '')}.zip`
	const output = fs.createWriteStream(zipath)
	const zipAchiver = archiver('zip')
	zipAchiver.pipe(output)
	for (let photo of photoInfo) {
		await model.photo.findByIdAndUpdate(photo._id, {
			$inc: {
				downloadCount: 1
			}
		})
		let photoPath = photo.originalInfo.path
		let photoName = uuid.v1().replace(/-/g, '')+ path.extname(photoPath)
		const rs = await store.getStream(photoPath)
		zipAchiver.append(rs.stream, {
			'name': photoName
		})
	}
	await zipAchiver.finalize()
	ctx.attachment(zipath)
	await send(ctx, zipath)
	fs.unlink(zipath)
})
module.exports = router