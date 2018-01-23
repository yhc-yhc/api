var amqp = require(“amqp”);
var fs = require(‘fs’);
var exchName = “topic”; //exhange 名称
var routeKey = “topic”; // 路由键

var connOptions = {
	host: ‘192.168 .65 .170’,
	port: 5672,
	login: ‘guest’,
	password: ‘guest’,
	authMechanism: ‘AMQPLAIN’,
	vhost: ‘ /’,
	ssl: {
		enabled: false
	}
}

var exchOption = {
	type: ‘topic’,
	durable: true,
	autoDelete: false,
	confirm: false
}

var messOption = {
	contentEncoding: “utf - 8”,
	deliveryMode: 1
}

var message = fs.readFileSync(‘2. txt’).toString(‘utf - 8’);
var conn = amqp.createConnection(connOptions); //连接rabbitmq
var n = 100000; // 循环数

var messFunc = function(e) {}

var exchFunc = function(exchange) {
	now = new Date();
	mill = now.getMilliseconds();
	console.log(now, mill);
	//[此处是我问题的点]
	for (var i = 0; i < n; i++) {
		exchange.publish(routeKey, new Buffer(message), ’’, messFunc); //发布消息 因为exchange属性confirm为false，此处不会回调messFunc
	}
	now = new Date();
	mill = now.getMilliseconds();
	console.log(now, mill);
}

var connFunc = function() {
	console.log(“ready”);
	var exch = conn.exchange(exchName, exchOption, exchFunc); //获取exchange 生成生产者
}

conn.on(‘ready’, connFunc); //rabbitmq连接成功调用connFunc