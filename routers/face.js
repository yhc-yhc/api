const Router = require('koa-router')
const router = new Router()
const multer = require('koa-multer')
const upload = multer({
	dest: 'uploads/'
})
const faceai = require('../faceai.js')

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
	log(body)
	if (!ctx.req.file) {
		throw httpStatus.paramErr
	}
	const {
		originalname,
		path,
		mimetype
	} = ctx.req.file
	// log(originalname, path, mimetype)
	let faceName = await faceai.searchSameFace(path)
	fse.unlink(path)

	ctx.body = {
		photos: []
	}
	// log(faceName)
	if (faceName) {
		const face = await model.face.findOne({
			name: faceName
		})
		if (face) {
			const photos = await model.photo.find({
				faces: face._id.toString()
			})
			// log(photos.length)
			ctx.body = {
				photos: photos
			}
		}
	}
})

module.exports = router