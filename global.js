global.log = console.log
global.loaddir = require('./tools/loaddir.js')
global.config = require('./config.js')
global.path = require('path')
global.fse = require('fs-extra')
global.util = require('util')
global.redis = require('redis')
global.cache = redis.createClient(config.redis)
global.getCache = util.promisify(cache.get).bind(cache)
global.mongoose = require('mongoose')
global.model = require('./mongodb/model.js')

cache.on("error", function (err) {
    console.log("Redis Error: " + err);
});
cache.on("ready", function (rs) {
    console.log("Redis Ready: ", config.redis.host, config.redis.port);
})

async function main() {
	cache.set("test", "test val", 'EX', 10);
	setInterval( async _ => {
		let test = await getCache('test')
		log(test)
	}, 10000);
	let userCount = await model.user.count()
	log(userCount)
}
// main()