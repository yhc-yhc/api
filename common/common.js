require('./thirdModules.js')

global.log = console.log
global.loaddir = require('../tools/loaddir.js')
global.config = loaddir('config')[process.env.RUN || 'dev']
global.httpStatus = loaddir('httpStatus')
global.logUtil = require('../tools/log_util.js')
global.model = require('../mongodb/model.js')
global.cache = redis.createClient(config.redis)
global.mqExchange = require('../mq/conn.js').mqExchange
global.mqPub = require('../mq/conn.js').mqPub
global.mqSub = require('../mq/conn.js').mqSub
global.endeurl = require('../tools/endeurl.js')
global.sendsms = require('../tools/sms.js')

global.request = Promise.promisifyAll(Promise.promisify(require('request')))
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)
Promise.promisifyAll(jwt)

const router = new Router()
global.router = app => {
	const routers = loaddir('routers')
	for (const r in routers) {
		router.use(`/${r}/`, routers[r].routes(), routers[r].allowedMethods())
		app.use(routers[r].routes()).use(routers[r].allowedMethods())
	}
}

cache.on("error", function(err) {
	console.log("redis Error: " + err)
})
cache.on("ready", function(rs) {
	console.log("redis Ready: ", config.redis.host, config.redis.port)
})

global.certs = {
	public: null,
	private: null
}
global.loadCert = async _ => {
	try {
		const p1 = fse.readFile(path.join('cert', 'public.pem'))
		const p2 = fse.readFile(path.join('cert', 'private.key'))
		const [public, private] = await Promise.all([p1, p2])
		certs.public = public
		certs.private = private
	} catch (err) {
		log(err)
	}
}

global.siteInfo = null
global.getSiteInfo = getSiteInfo
async function getSiteInfo() {
	const parks = await global.model.park.find({}, {
		_id: 0,
		siteId: 1,
		name: 1,
		bgUrl: 1,
	})
	global.siteInfo = parks.reduce((pre, cur) => {
		pre[cur.siteId] = {
			parkName: cur.name || 'PictureAir',
			bgUrl: cur.bgUrl || '/sites/common/background.png',
			barUrl: cur.barUrl || '/sites/common/background.png',
			pageUrl: cur.pageUrl || 'http://web.pictureair.com/',
			ocrCard: cur.ocrCard || false,
			faceCard: cur.faceCard || false,
			type: cur.type || 0
		}
		return pre
	}, {})
}