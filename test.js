var amqp = require('amqp');
var i = 0;
var connection = amqp.createConnection({
  host: '192.168.8.58',
  port: 5672,
  login: 'guest',
  password: 'guest',
  connectionTimeout: 10000,
});

// add this for better debuging 
connection.on('error', function(e) {
  console.log("Error from amqp: ", e);
});

connection.on('ready', function() {
  console.log('mq ready ...')

  exchange = connection.exchange('engine', {
    type: 'direct',
    autoDelete: false,
    // durable: true
  });
  connection.queue("new_file", {
    autoDelete: false
  }, function(queue) {
    queue.bind('engine', 'new_file', function() {
      setInterval(function() {
        i++;
        console.log('publish message ' + i)
        exchange.publish('new_file', 'this is a '+ i +' testing message ......');
      }, Math.random() * 2000);

      // setTimeout(function() {
      //   console.log("Single queue bind callback succeeded");
      //   //exchange.destroy();  
      //   //queue.destroy();  
      //   connection.end();
      //   connection.destroy();
      // }, 5000);

    });

    // queue.subscribe(function(message) {
    //   console.log('At 5 second recieved message is:' + message.data );
    // });

  });
});