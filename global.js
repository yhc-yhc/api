global.Promise = require('bluebird')
global.log = console.log
global.loaddir = require('./tools/loaddir.js')
global.config = require('./config.js')
global.path = require('path')
global.fse = require('fs-extra')
global.moment = require('moment')
global.util = require('util')
global.crypto = require('crypto')
global.extRes = require('./tools/response.js')
global.resInfo = require('./tools/resInfo.js')
global.request = Promise.promisifyAll(Promise.promisify(require('request')))
global.redis = require('redis')
global.cache = redis.createClient(config.redis)
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
global.mongoose = require('mongoose')
global.model = require('./mongodb/model.js')
global.amqp = require('amqp')
global.mqExchange = require('./mq/conn.js').mqExchange
global.mqPub = require('./mq/conn.js').mqPub
global.mqSub = require('./mq/conn.js').mqSub
global.sendsms = require('./tools/sms.js')

cache.on("error", function(err) {
	console.log("redis Error: " + err)
})
cache.on("ready", function(rs) {
	console.log("redis Ready: ", config.redis.host, config.redis.port)
})

async function main() {
	mqSub('exchange_a', 'route_a')
	mqSub('exchange_b', 'route_b')

	cache.set("test", "test val", 'EX', 10)
	setInterval(async _ => {
		let test = await cache.getAsync('test')
		log(test)
	}, 10000)
	let userCount = await model.user.count()
	log('user num: ', userCount)
	log(moment().format('YYYY/MM/DD HHmmss'))
	await mqPub('exchange_a', 'route_a', 'first msg', _ => {
		log('a1')
	})
	await mqPub('exchange_b', 'route_b', 'second msg')
}
// main()