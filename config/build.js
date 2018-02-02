const path = require('path')

module.exports = {
    host: 'localhost',
    port: 3000,
    log: {
        base: path.join(process.env.HOME, '/logs/api'),
        err: '/error',
        res: '/res'
    },
    redis: {
        host: "10.25.155.219",
        port: "3008",
        password: "pw#p@Ictur3"
    },
    cacheExpire: {
        smsvcode: 90
    },
    mongodb: {
        url: 'mongodb://10.26.143.51,10.26.143.74,10.26.142.237:1008/pictureAir',
        opt: {
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0
        }
    },
    mq: {
        connOpt: {
            host: '172.18.0.20',
            port: 5672,
            login: 'guest',
            password: 'guest',
            connectionTimeout: 10000,
            authMechanism: 'AMQPLAIN',
            vhost: '/',
            ssl: {
                enabled: false
            }
        },
        exchangeOpt: {
            type: 'direct',
            durable: false,
            autoDelete: false,
            confirm: true
        },
        queueOpt: {
            autoDelete: false
        },
        queueSubOpt: {
            ack: true,
            prefetchCount: 1
        },
        msgOpt: {
            contentEncoding: 'utf-8',
        }
    },
    sms: {
        url: 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms',
        appkey: '291db2d72f0ccc3ead9d16e7060d7832',
        sdkappid: '1400043867',
        tpl_map: {
            register: {
                86: 51141,
                others: 51296
            }
        },
        tpl_sign: {
            86: '相集',
            others: 'PictureAir'
        }

    }
}