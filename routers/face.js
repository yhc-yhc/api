const Router = require('koa-router')
const router = new Router()
const asyncBusboy = require('async-busboy')

const childM = require('../tools/childM.js')
function SearchFeatureFromChlid(path) {
	return new Promise((resolve, reject) => {
		childM({
			flag: `searchSameFace_::_${nanoid(10)}`,
			data: path
		}, (err, data) => {
			resolve(data)
		})
	})
}

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
	let cardInfo = ctx.params.siteId + '_' + ctx.params.date + '_' + ctx.params.code
	const rs = await model.face.update({
		_id: ctx.params.faceId,
		disabled: false
	}, {
		$addToSet: {
			bindInfo: cardInfo
		}
	})
})

router.post('searchPhotosByImage', async(ctx, next) => {
	console.time('SearchFeature: ')
		// let faceAry = await faceai.searchSameFace(ctx.files.file)
	let faceAry = await SearchFeatureFromChlid(ctx.files.file)
	console.timeEnd('SearchFeature: ')
	fse.unlink(ctx.files.file)

	ctx.body = []
	if (!faceAry[0]) return

	console.time('SearchDB: ')
	const faces = await model.face.find({
		name: faceAry
	})
	const ary = faces.map(face => face._id.toString())
	if (!ary[0]) return

	const dateEnd = moment(new Date(ctx.params.date)).add(1, 'days').format('YYYY/MM/DD')
	const photos = await model.photo.find({
			faces: ary,
			siteId: ctx.params.siteId,
			'customerIds.code': ctx.params.code,
			shootOn: {
				$gte: new Date(ctx.params.date),
				$lt: new Date(dateEnd)
			}
		}, {
			_id: 0,
			thumbnail: 1,
			original: 1,
			orderHistory: 1
		})
		// log(photos.length)
	ctx.body = photos.map(photo => {
		return {
			_id: photo._id,
			x512: photo.thumbnail.x512.url,
			x1024: photo.thumbnail.x1024.url,
			url: photo.original.url,
			pay: orderHistory[0] ? true : false
		}
	})
	console.timeEnd('SearchDB: ')
})

router.post('searchCardsByImage', async(ctx, next) => {

	console.time('SearchFeature: ')
	let faceAry = await SearchFeatureFromChlid(ctx.files.file)
	console.timeEnd('SearchFeature: ')
	fse.unlink(ctx.files.file)

	ctx.body = []
	if (!faceAry[0]) return

	console.time('SearchDB: ')
	const faces = await model.face.find({
		name: faceAry
	})
	const ary = faces.map(face => face._id.toString())
	if (!ary[0]) return
	const photos = await model.photo.find({
		faces: ary,
	}, {
		_id: 0,
		thumbnail: 1,
		original: 1,
		orderHistory: 1,
		siteId: 1,
		'customerIds.code': 1,
		shootOn: 1
	})
	console.timeEnd('SearchDB: ')

	const cards = await services.photo.photosToCards(photos)
	ctx.body = cards
})

module.exports = router