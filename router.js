const Router = require('koa-router')
const router = new Router()

module.exports = app => {
	const routers = loaddir('routers')
	// console.log(routers)
	for (const r in routers) {
		router.use(`/${r}/`, routers[r].routes(), routers[r].allowedMethods())
		app.use(routers[r].routes()).use(routers[r].allowedMethods())
	}
}