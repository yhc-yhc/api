const Router = require('koa-router')
const router = new Router()
const multer = require('koa-multer')
const upload = multer({
	dest: 'uploads/'
})
const faceai = require('../faceai.js')

router.post('getFacesOfCard', async(ctx, next) => {
	ctx.body = [{
		"code": "PACC324YKBWUHD78",
		"date": "2018/02/21",
		"faces": [{
			"_id": "5a9788bfac7cb9001c91fbec",
			"url": "media/924fe72bd415d0c0e3a096d64e26f02bb81c721fe578aa945d28b739fe20b81aafa0a5a1a0198a12dca381648813bc93"
		}]
	}]
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
		// log(faceAry)
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