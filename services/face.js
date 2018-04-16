const childM = require('../tools/childM.js')
const idGenerate = require('nanoid/generate')
const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

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

exports.matchFileFromChlid = (path, faceId) => {
	return new Promise((resolve, reject) => {
		childM({
			flag: `matchFile_::_${nanoid(10)}`,
			data: {
				path,
				faceId
			}
		}, (err, data) => {
			resolve(data)
		})
	})
}

exports.getFeatureStrFromChlid = path => {
	return new Promise((resolve, reject) => {
		childM({
			flag: `getFeatureStr_::_${nanoid(10)}`,
			data: path
		}, (err, data) => {
			resolve(data)
		})
	})
}

exports.matchFeatureFromChlid = (featureStr, featureId) => {
	return new Promise((resolve, reject) => {
		childM({
			flag: `matchFeature_::_${nanoid(10)}`,
			data: {
				featureStr,
				featureId
			}
		}, (err, data) => {
			resolve(data)
		})
	})
}

exports.matchFeature = (featureStr, faceObj) => {
	const source = await this.matchFeatureFromChlid(featureStr, faceObj.faceIds)
	faceObj.source = source
	return faceObj
}

exports.searchFeatureFromChlid = path => {
	return new Promise((resolve, reject) => {
		childM({
			flag: `searchSameFace_::_${nanoid(10)}`,
			data: path
		}, (err, data) => {
			resolve(data)
		})
	})
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