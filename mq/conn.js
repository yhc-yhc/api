const conn = amqp.createConnection(config.mq.connOpt)

let connFlag = false
const exchangeObj = {}
const queueObj = {}
  // add this for better debuging 
conn.on('error', e => {
  connFlag = false
  log('amqp errror: ', e)
})

conn.on('ready', _ => {
  connFlag = true
  log('amqp ready at ', config.mq.connOpt.host, config.mq.connOpt.port)
})

async function ensureConn() {
  if (!connFlag) {
    const mqOn = util.promisify(conn.on).bind(conn)
    await mqOn('ready')
    // log('ready in fun')
  }
}

async function Exchange(exchangeName) {
  if (!connFlag) await ensureConn()
  // log(exchangeName)
  return new Promise((resolve, reject) => {
    conn.exchange(exchangeName, config.mq.exchangeOpt, (exchange) => {
      exchangeObj[exchangeName] = exchange
      resolve(0)
    })
  })
}

async function Queue(exchangeName, routeKey) {
  if (!connFlag) await ensureConn()
  if (!exchangeObj[exchangeName]) await Exchange(exchangeName)
  return new Promise((resolve, reject) => {
    conn.queue(routeKey, config.mq.queueOpt, (queue) => {
      queue.bind(exchangeName, routeKey)
      queueObj[routeKey] = queue
      resolve(0)
    })

  })
}

exports.mqPub = async(exchangeName, routeKey, msg, cb) => {
  if (!exchangeObj[exchangeName]) await Exchange(exchangeName)
  const exchange = exchangeObj[exchangeName]
  // log(msg)
  exchange.publish(routeKey, msg, config.mq.msgOpt, cb)
}

exports.mqSub = async(exchangeName, routeKey) => {
  if (!queueObj[routeKey]) await Queue(exchangeName, routeKey)
  const queue = queueObj[routeKey]
  queue.subscribe(config.mq.queueSubOpt, function(message, headers, deliveryInfo, messageObject) {
    console.log(exchangeName, routeKey, 'recieved message is ', message.data.toString())
    messageObject.acknowledge()
  })
}