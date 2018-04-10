const oss = require('ali-oss').Wrapper
const store = oss({
	accessKeyId: 'LTAIamKqehuCllfX',
	accessKeySecret: '6sr2fdtUJHQK1GaKJdjY1JDNg94YrM',
	region: 'oss-cn-hongkong',

})
global.log = console.log
global.loaddir = require('./loaddir.js')
global.config = require('../config.js')
global.mongoose = require('mongoose')
global.model = require('../mongodb/model.js')

const saveToOss = async(bucketName, name, path) => {
	store.useBucket(bucketName)
	const rs = await store.put(name, buffer)
	return rs.name
}

main()
async function main() {
	const photos = await model.photo.find({
		oss: {
			$exists: false
		}
	}).limit(10)
	log(photos.length)
	for (let photo of photos) {
		
	}
}