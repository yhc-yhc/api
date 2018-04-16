const idGenerate = require('nanoid/generate')
const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const faceai = require('../faceai.js')

exports.getFaceInfo = async(faceObj, date, siteId, code) => {

	const face = await model.face.findOne({
		_id: faceObj._id
	}, {
		_id: 0,
		url: 1
	})
	faceObj.url = face.url

	const count = await model.faceBindCard.count({
		faceId: faceObj._id,
		bindDate: new Date(date),
		bindSiteId: siteId,
		bindCode: code,
		disabled: false
	})
	if (count > 0) {
		faceObj.bind = true
	} else {
		faceObj.bind = false
	}
	return faceObj
}

exports.matchFile = async(path, faceId) => {
	return await faceai.matchFile(path, faceId)
}

exports.getFeatureBuf = async(path) => {
	return await faceai.getFeatureBuf(path)
}

exports.matchFeatureBuf = async (featureBuf, ids) => {
	return await faceai.matchFeatureBuf(featureBuf, ids)
}

exports.addFaceCards = async (groups, faces) => {
	const cardCodes = []
	const promises = []
	for (let group of groups) {
		let cardNo = `${group._id.siteId}FC`
		cardNo += idGenerate(alphabet, 5)
		let len = 16 - cardNo.length
		cardNo += idGenerate(alphabet, len)
		cardCodes.push({
			code: cardNo
		})
		const promise = model.photo.update({
			faceIds: {
				$in: faces
			},
			shootOn: {
				$gte: new Date(group._id.shootOn),
				$lt: new Date(new Date(group._id.shootOn).getTime() + 86400000)
			},
			siteId: group._id.siteId
		}, {
			$addToSet: {
				customerIds: {
					code: cardNo,
				}
			}
		}, {
			multi: true
		})
		promises.push(promise)
	}
	await Promise.all(promises)
	return cardCodes
}