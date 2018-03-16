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
		shootOn: {
			$gte: new Date(ctx.params.date),
			$lt: new Date(dateEnd)
		}
	}, {
		faces: 1
	})
	const faces = photos.reduce((pre, cur) => {
		cur.faces.reduce((ppre, ccur) => {
			ppre[ccur] = ppre[ccur] || 0
			ppre[ccur] ++
			return ppre
		}, pre)
		return pre
	}, {})
	log(ctx.params.date, dateEnd, faces)
	ctx.body = faces
})

router.get('list', async(ctx, next) => {
	const faces = await model.face.find({
		disabled: false
	}, {
		_id: 0,
		disabled: 0
	}).limit(1000)
	ctx.body = {
		count: faces.length,
		info: faces
	}
})

router.post('searchByImage', upload.single('file'), async(ctx, next) => {
	const body = ctx.req.body
	const api = httpStatus[ctx._url][ctx.method]
	if (!ctx.req.file) {
		throw httpStatus.paramErr
	}
	const {
		originalname,
		path,
		mimetype
	} = ctx.req.file
		// log(originalname, path, mimetype)
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
					faces: ary
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