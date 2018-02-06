const Router = require('koa-router')
const router = new Router()
const multer = require('koa-multer')
const upload = multer({
	dest: 'uploads/'
})
const faceai = require('./faceai.js')

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

router.post('serachByImage', upload.single('file'), async(ctx, next) => {
	const body = ctx.req.body
	const api = httpStatus[ctx._url][ctx.method]
	log(body)
	const {
		originalname,
		path,
		mimetype
	} = ctx.req.file
	log(originalname, path, mimetype)
	let faceName = await faceai.searchSameFace(path)
	fse.unlink(path)

	if (!faceName) {
		const face = await model.face.find({
			name: faceName
		})
		ctx.body = {
			photos: await model.photos.find({
				faces: {
					$in: face.photos
				}
			})
		}
	} else {
		ctx.body = {
			photos: []
		}
	}
})

module.exports = router