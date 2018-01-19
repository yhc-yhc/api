var redis = require("redis"),
    client = redis.createClient({
            "host": "192.168.8.107",
            "port": "3008",
            "password": "pIctur3"
        });
    client.on("error", function (err) {
	    console.log("Error " + err);
	});
	client.on("ready", function (rs) {
	    console.log("redis ready");
	});
const util = require('util');
const getAsync = util.promisify(client.get).bind(client);
