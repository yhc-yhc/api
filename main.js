require('./global.js')
const faceai = require('./faceai.js')

async function loadFace() {
	const faces = await model.face.find({disabled: false}, {
		name: 1
	})
	log(`will load ${faces.length} ...`)
	for (const face of faces) {
		await faceai.loadFaceToMap(face.name + '.jpg')
	}
}

async function main() {
	await loadFace()
	await engine()
}

async function engine() {
	let photoCount = await model.photo.count()
	log(`total has ${photoCount} photos`)
	const photos = await model.photo
		.find({
			'faces.0': {
				$exists: false
			},
			presetName: 'thumbnail'
		}, {
			originalInfo: 1,
			rawFileName: 1
		})
		.limit(1000).sort({
			_id: -1
		}).exec()
	log('will process: ', photos.length)
	for (const photo of photos) {
		const face_map = await faceai.process(photo.originalInfo.path)
		log(21, face_map)
		if (!Object.keys(face_map).length) {
			await model.photo.update({
				rawFileName: photo.rawFileName
			}, {
				$set: {
					faces: ['noface']
				}
			}, {
				multi: true
			}).exec()
		} else {
			for (let faceId in face_map) {
				if (!face_map[faceId]) {
					const face = new model.face()
					face.name = faceId
					face.photos = [photo._id.toString()]
					const rs = await face.save()
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
				} else {
					const face = await model.face.findOne({
						name: face_map[faceId]
					}).exec()
					await model.face.update({
						name: face_map[faceId]
					}, {
						$addToSet: {
							photos: photo._id.toString()
						}
					})
					await model.photo.update({
						rawFileName: photo.rawFileName,
						'faces.0': {
							$exists: false
						}
					}, {
						$set: {
							faces: [face._id.toString()]
						}
					}, {
						multi: true
					}).exec()
					await model.photo.update({
						rawFileName: photo.rawFileName,
						'faces.0': {
							$exists: true
						}
					}, {
						$addToSet: {
							faces: face._id.toString()
						}
					}, {
						multi: true
					}).exec()
				}
			}
		}
	}
	log('====================================')
	await Promise.delay(2000)
	await engine()
}

main()