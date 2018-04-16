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

exports.matchFeatureFromChlid = (path, faceId) => {
	return new Promise((resolve, reject) => {
		childM({
			flag: `matchFace_::_${nanoid(10)}`,
			data: {path, faceId}
		}, (err, data) => {
			resolve(data)
		})
	})
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

exports.addFaceCards = async photos => {
	const _cards = photos.reduce((pre, cur) => {
		let dayStr = moment(new Date(cur.shootOn)).format('YYYYMMDD')
		let id = `${cur.siteId}__${dayStr}`
		pre[id] = pre[id] || {}
		let cardNo = `${cur.siteId}FC`
		cardNo += idGenerate(alphabet, 5)
		let len = 16 - cardNo.length
		cardNo += idGenerate(alphabet, len)
		pre[id].cardNo = cardNo
		pre[id]._ids = pre[id]._ids || []
		pre[id]._ids.push(cur._id)
		return pre
	}, {})
	const cardCodes = []
	const promises = []
	for (card in _cards) {
		cardCodes.push({
			code: _cards[card].cardNo
		})
		const promise = model.photo.update({
			_id: {
				$in: _cards[card]._ids
			}
		}, {
			$addToSet: {
				customerIds: {
					code: _cards[card].cardNo,
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