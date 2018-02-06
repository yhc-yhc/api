const Router = require('koa-router')
const router = new Router()

router.get('list', async(ctx, next) => {
	const faces = await model.face.find({
		disabled: false
	}, {
		_id: 0,
		disabled: 0
	})
	ctx.body = {
		count: faces.length,
		info: faces
	}
})

module.exports = router