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

router.post('searchByImage', upload.single('file'), async(ctx, next) => {
	const dateEnd = moment(new Date(ctx.params.date)).add(1, 'days').format('YYYY/MM/DD')
	const {
		originalname,
		path,
		mimetype
	} = ctx.req.file
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
					thumbnail: 1
				})
				// log(photos.length)
			ctx.body = {
				photos: photos
			}
		}
		console.timeEnd('SearchDB: ')
	}
})

module.exports = router