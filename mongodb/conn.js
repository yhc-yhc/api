const conn = mongoose.createConnection(config.mongodb.url, config.mongodb.opt);
conn.on('open', function () {
    console.log("mongodb open: ", config.mongodb.url);
})
conn.on('error', function (err) {
    console.log("mongodb error: ", err);
})
module.exports = conn
