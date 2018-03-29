global.Promise = require('bluebird')
global.log = console.log
global.nanoid = require('nanoid')
global.loaddir = require('./tools/loaddir.js')
global.config = require('./config.js')
global.path = require('path')
global.log4js = require('log4js')
global.logUtil = require('./tools/log_util.js')
global.fse = require('fs-extra')
global.moment = require('moment')
global.util = require('util')
global.crypto = require('crypto')
global.httpStatus = loaddir('httpStatus')
global.request = Promise.promisifyAll(Promise.promisify(require('request')))

global.mongoose = require('mongoose')
global.model = require('./mongodb/model.js')

global.redis = require('redis')
global.services = loaddir('./services')
global.cache = redis.createClient(config.redis)
Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)
cache.on("error", function(err) {
	console.log("redis Error: " + err)
})
cache.on("ready", function(rs) {
	console.log("redis Ready: ", config.redis.host, config.redis.port)
})

global.amqp = require('amqp')
global.mqExchange = require('./mq/conn.js').mqExchange
global.mqPub = require('./mq/conn.js').mqPub
global.mqSub = require('./mq/conn.js').mqSub
global.sendsms = require('./tools/sms.js')

global.jwt = require('jsonwebtoken')
Promise.promisifyAll(jwt)

global.certs = {
	public: null,
	private: null
}
global.loadCert = async _ => {
	try {
		const p1 = fse.readFile(path.join('./cert', 'public.pem'))
		const p2 = fse.readFile(path.join('./cert', 'private.key'))
		const [public, private] = await Promise.all([p1, p2])
		certs.public = public
		certs.private = private
	} catch (err) {
		log(err)
	}
}

global.endeurl = require('./tools/endeurl.js')

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
			parkName: cur.name,
			cardImage: cur.bgUrl
		}
		return pre
	}, {})
}

async function main() {
	// init logs
	log('all the logs will write at: ', config.log.base)
	await fse.ensureDir(config.log.base)
		//test
	mqSub('exchange_a', 'route_a')
	mqSub('exchange_b', 'route_b')

	cache.set("test", "test val", 'EX', 10)
	let token = await cache.getAsync('access_token:' + 'c964b871b3c993c8aea71ef9918e8926')
		// log(43, JSON.parse(token))
	let test = await cache.getAsync('test')
	log(test)
		// setInterval(async _ => {
		// 	let test = await cache.getAsync('test')
		// 	log(test)
		// }, 10000)
	let userCount = await model.user.count()
	log('user num: ', userCount)
	log(moment().format('YYYY/MM/DD HHmmss'))
	await mqPub('exchange_a', 'route_a', 'first msg', _ => {
		log('mq ack cb function')
	})
	await mqPub('exchange_b', 'route_b', 'second msg')
}
// main()