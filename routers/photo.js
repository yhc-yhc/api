const Router = require('koa-router')
const router = new Router()
router.get('/', (ctx, next) => {
	ctx.body = 'photo index!';
})
router.get('photo', (ctx, next) => {
	ctx.body = 'photo!';
})
module.exports = router