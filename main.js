require('./global.js')
const faceai = require('./faceai.js')

async function loadFace() {
	const faces = await model.face.find({disabled: false}, {
		name: 1,
		feature: 1
	})
	log(`will load ${faces.length} faces from db ...`)
	for (const face of faces) {
		await faceai.loadFaceToMap(face.name, face.feature)
	}
}

async function main() {
	await loadFace()
	await engine()
}

async function engine() {
	let photoCount = await model.photo.count()
	log(`total has ${photoCount} photos`)
	let oneDayAgo = moment().add(-1, 'days').format('YYYY/MM/DD')

	const photos = await model.photo
		.find({
			shootOn: {
				$gte: new Date(oneDayAgo)
			},
			'faces.0': {
				$exists: false
			},
			presetName: 'thumbnail'
		}, {
			originalInfo: 1,
			rawFileName: 1
		})
		.limit(10).sort({
			_id: -1
		}).exec()
	log('will process: ', photos.length)
	for (const photo of photos) {
		const face_map = await faceai.process(photo.originalInfo.path)
		// log(21, face_map)
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
					face.disabled = false
					face.feature = faceai.face2m[faceId]
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