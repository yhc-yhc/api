require('../common/global.js')
const faceai = require('../faceai.js')

process.on('message', async function(m) {
	const mem = process.memoryUsage()
	log(`pid_${process.pid}: `, (mem.rss / 1024 / 1024).toFixed(2), (mem.heapTotal / 1024 / 1024).toFixed(2), (mem.heapUsed / 1024 / 1024).toFixed(2))
	var flag = m.flag
	if (flag.split('_::_')[0] != 'matchFace') {
		let source = await faceai.matchFace(m.data)
		process.send({
			flag: m.flag,
			data: source
		})
	}

	if (flag.split('_::_')[0] != 'searchSameFace') {
		let faceAry = await faceai.searchSameFace(m.data)
		process.send({
			flag: m.flag,
			data: faceAry
		})
	}
})

async function loadFace() {
	const faces = await model.face.find({
		disabled: false
	}, {
		name: 1,
		feature: 1
	})
	log(`pid_${process.pid}:  will load ${faces.length} faces from db ...`)
	for (const face of faces) {
		await faceai.loadFaceToMap(face.name, face.feature)
	}
}

async function engine() {
	let oneDayAgo = moment().add(-14, 'days').format('YYYY/MM/DD')
	const photos = await model.photo
		.find({
			shootOn: {
				$gte: new Date(oneDayAgo)
			},
			'faceIds.0': {
				$exists: false
			},
			presetName: 'thumbnail'
		}, {
			'originalInfo.path': 1,
			rawFileName: 1,
			shootOn: 1
		})
		.limit(4).sort({
			_id: -1
		}).exec()
	for (const photo of photos) {
		const face_map = await faceai.process(photo.originalInfo.path)
		if (!Object.keys(face_map).length) {
			await model.photo.update({
				rawFileName: photo.rawFileName
			}, {
				$set: {
					faceIds: ['noface']
				}
			}, {
				multi: true
			}).exec()
		} else {
			for (let faceId in face_map) {
				if (!face_map[faceId]) {
					const face = new model.face()
					face.name = faceId
					let str = '/faces/' + faceId + '.jpg'
					let url = 'media/' + endeurl.enurl(str)
					face.url = url
					face.active = photo.shootOn
					face.disabled = false
					face.feature = faceai.featureMap[faceId]
					const rs = await face.save()
					await model.photo.update({
						rawFileName: photo.rawFileName,
						'faceIds.0': {
							$exists: false
						}
					}, {
						$set: {
							faceIds: [rs._id.toString()]
						}
					}, {
						multi: true
					}).exec()
					await model.photo.update({
						rawFileName: photo.rawFileName,
						'faceIds.0': {
							$exists: true
						}
					}, {
						$addToSet: {
							faceIds: rs._id.toString()
						}
					}, {
						multi: true
					}).exec()
				} else {
					const face = await model.face.findOne({
						name: face_map[faceId]
					}).exec()
					await model.face.update({
						_id: face._id
					}, {
						$set: {
							active: photo.shootOn
						}
					}, {
						upsert: true
					})
					await model.photo.update({
						rawFileName: photo.rawFileName,
						'faceIds.0': {
							$exists: false
						}
					}, {
						$set: {
							faceIds: [face._id.toString()]
						}
					}, {
						multi: true
					}).exec()
					await model.photo.update({
						rawFileName: photo.rawFileName,
						'faceIds.0': {
							$exists: true
						}
					}, {
						$addToSet: {
							faceIds: face._id.toString()
						}
					}, {
						multi: true
					}).exec()
				}
			}
		}
	}
	await Promise.delay(5000)
	await engine()
}

async function main() {
	await loadFace()
	// await engine()
}
main()