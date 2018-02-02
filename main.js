require('./global.js')
const faceai = require('./faceai.js')

async function faceProcess() {
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
		if (!ary.length) {
			await model.photo.update({
				rawFileName: photo.rawFileName
			}, {
				$set: {
					faces: ['none']
				}
			}, {
				multi: true
			}).exec()
		}
		for (key of ary) {
			log(key)
			const face = new model.face()
			face.name = key
			const rs = await face.save()
			log(rs)
			await model.photo.update({
				rawFileName: photo.rawFileName,
				'faces.0': {
					$exists: true
				}
			}, {
				$addToSet: {
					faces: rs._id.toString()
				}
			}, {
				multi: true
			}).exec()
			await model.photo.update({
				rawFileName: photo.rawFileName,
				'faces.0': {
					$exists: false
				}
			}, {
				$set: {
					faces: [rs._id.toString()]
				}
			}, {
				multi: true
			}).exec()
		}
	}
}

async function main() {
	setInterval(async _ => {
		await faceProcess()
	}, 2000)
}

main()