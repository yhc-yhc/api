require('./global.js')
const faceai = require('./faceai.js')

async function main() {
	let photoCount = await model.photo.count()
	log(`total has ${photoCount} photos`)
	const photos = await model.photo
		.find({
			'faces.0': {
				$exists: false
			},
			presetName: 'thumbnail'
		}, {
			thumbnail: 1,
			rawFileName: 1
		})
		.limit(1000).exec()
	log('will process: ', photos.length)
	for (const photo of photos) {
		const ary = await faceai.process(photo.thumbnail.x512.path)
		log(21, ary)
		for (key of ary) {
			log(key)
			const face = new model.face()
			face.name = key
			const rs = await face.save()
			log(rs)
			await model.photo.update({rawFileName: photo.rawFileName}, {$addToSet: {faces: rs._id}}, {multi: true})
		}
	}
}

main()