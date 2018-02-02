require('./global.js')
const faceai = require('./faceai.js')

async function main() {
	let photoCount = await model.photo.count()
	log(`total has ${photoCount} photos`)
	const photos = await model.photo
	.find({'faces.0': {$exists: false}, presetName : 'thumbnail'}, {originalInfo: 1, rawFileName: 1})
	.limit(1000).exec()
	log('will process: ', photos.length)
	for (const photo of photos) {
		const {k, p} = await faceai.faceProcess(photo.originalInfo.path)
		const face = new model.face()
		face.name = k 
		face.code = p 
		const rs = await face.save()
		log(rs)
		// awati model.photo.update({}, {})

	}
}

main()
