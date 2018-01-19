module.exports = {
    port: 3000,
    redis: {
        host: "192.168.8.107",
        port: "3008",
        password: "pIctur3"
    },
    mongodb: {
        // url: 'mongodb://pictureworks:123qweasd@10.10.20.232,10.10.20.233,10.10.20.234:27000/pictureAir',
        url: 'mongodb://192.168.8.107:1008/pictureAir',
        opt: {
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0
        }
    }
}