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

const saveToOss = async (bucketName, name, path) => {
	const result = await store.listBuckets({prefix: bucketName})
	console.log('buckets: ', result)
	if (!result.buckets) {
		await store.putBucket(bucketName)
	}
	store.useBucket(bucketName)
	const rs = await store.put(name, buffer)
	return rs.name
}

main()
async function main() {
	log('main')
}