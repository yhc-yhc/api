const Router = require('koa-router')
const router = new Router()
router.get('/', (ctx, next) => {
	ctx.body = 'photo index!';
})
router.get('listPhotos', (ctx, next) => {
	
  

})
module.exports = router