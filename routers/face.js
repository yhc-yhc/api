const Router = require('koa-router')
const router = new Router()
const multer = require('koa-multer')
const upload = multer({
	dest: 'uploads/'
})
const faceai = require('../faceai.js')

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

router.post('searchPhotosByImage', upload.single('file'), async(ctx, next) => {
	const dateEnd = moment(new Date(ctx.params.date)).add(1, 'days').format('YYYY/MM/DD')
	const {
		originalname,
		path,
		mimetype
	} = ctx.req.file
	if (!path) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006'][ctx.LG],
			router: ctx.url
		}
	}
	console.time('SearchFeature: ')
	let faceAry = await faceai.searchSameFace(path)
	console.timeEnd('SearchFeature: ')
	fse.unlink(path)

	ctx.body = {
		photos: []
	}
	if (faceAry[0]) {
		console.time('SearchDB: ')
		const faces = await model.face.find({
			name: faceAry
		})
		const ary = faces.map(face => face._id.toString())
		if (ary[0]) {
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
		}
		console.timeEnd('SearchDB: ')
	}
})

router.post('searchCardsByImage', upload.single('file'), async(ctx, next) => {
	const {
		originalname,
		path,
		mimetype
	} = ctx.req.file
	if (!path) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006'][ctx.LG],
			router: ctx.url
		}
	}
	console.time('SearchFeature: ')
	let faceAry = await faceai.searchSameFace(path)
	console.timeEnd('SearchFeature: ')
	fse.unlink(path)

	ctx.body = {
		photos: []
	}
	if (faceAry[0]) {
		console.time('SearchDB: ')
		const faces = await model.face.find({
			name: faceAry
		})
		const ary = faces.map(face => face._id.toString())
		if (ary[0]) {
			const photos = await model.photo.find({
				faces: ary,
			}, {
				_id: 0,
				thumbnail: 1,
				original: 1,
				orderHistory: 1,
				siteId: 1,
				customerIds.code: 1,
				shootOn: 1
			})
			console.timeEnd('SearchDB: ')

			const codePhotos = []
			photos.forEach(photo => {
				if (photo.customerIds.length == 1) {
					codePhotos.push({
						code: photo.customerIds[0].code,
						date: moment(new Date(photo.shootOn)).format('YYYY.MM.DD'),
						siteId: photo.siteId,
						url: photo.thumbnail.x512.url,
						pay: photo.orderHistory[0] ? true : false
					})
				} else {
					for (let code of photo.customerIds) {
						codePhotos.push({
							code: code,
							date: moment(new Date(photo.shootOn)).format('YYYY.MM.DD'),
							siteId: photo.siteId,
							url: photo.thumbnail.x512.url,
							pay: photo.orderHistory[0] ? true : false
						})
					}
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
					photos: codePhotos[card].photos.length ==1 ? ary.fill(codePhotos[card].photos[1]) : codePhotos[card].photos.silice(0, 2),
					pay: codePhotos[card].pay,
					payCount: codePhotos[card].payCount,
				})
			}
			ctx.body = cards
		}
	}
})

module.exports = router