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
	let obj = ctx.req.file
	if (!obj) {
		throw {
			status: 10006,
			message: httpStatus.common.system['10006'][ctx.LG],
			router: ctx.url
		}
	}
	const {
		originalname,
		path,
		mimetype
	} = obj
	console.time('SearchFeature: ')
	let faceAry = await faceai.searchSameFace(path)
	console.timeEnd('SearchFeature: ')
	fse.unlink(path)

	ctx.body = {
		photos: []
	}
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
	const _cards = codePhotos.reduce((pre, cur) => {
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
	for (card in _cards) {
		const ary = new Array(2)
		const photos = _cards[card]._photos.map(obj => obj.url)
		const pay = _cards[card]._photos.every(obj => obj.pay)
		const payCount = _cards[card]._photos.map(obj => obj.pay).length
		cards.push({
			code: _cards[card].code,
			date: _cards[card].date,
			siteId: _cards[card].siteId,
			photoCount: _cards[card]._photos.length,
			photos: _cards[card]._photos.length == 1 ? ary.fill(photos[0]) : photos.slice(0, 2),
			pay: pay,
			payCount: payCount
		})
	}
	ctx.body = cards
})

module.exports = router