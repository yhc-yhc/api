const oss = require('ali-oss').Wrapper
const store = oss({
	accessKeyId: 'LTAIamKqehuCllfX',
	accessKeySecret: '6sr2fdtUJHQK1GaKJdjY1JDNg94YrM',
	region: process.env.RUN == 'product' ? 'oss-cn-hongkong' : 'oss-cn-shanghai',
	timeout: 120000

})
exports.photosToCards = async(photos, codes) => {
	const codePhotos = []
	photos.forEach(photo => {
		const cusCode = photo.customerIds.map(obj => obj.code)
		let _codes = []
		for (let code of cusCode) {
			if (codes.indexOf(code) != -1) {
				_codes.push(code)
			}
		}

		const date = moment(new Date(photo.shootOn)).format('YYYY.MM.DD')
		const pay = photo.orderHistory[0] ? true : false
		for (let code of _codes) {
			codePhotos.push({
				code: code,
				date: date,
				siteId: photo.siteId,
				url: photo.thumbnail.x512.url,
				pay: pay
			})
		}
	})
	const _cards = codePhotos.reduce((pre, cur) => {
		let id = `${cur.code}__${cur.siteId}__${cur.date}`
		pre[id] = pre[id] || {}
		pre[id].code = cur.code
		pre[id].siteId = cur.siteId
		pre[id].date = cur.date
		pre[id]._photos = pre[id]._photos || []
		pre[id]._photos.push({
			url: cur.url,
			pay: cur.pay
		})
		return pre
	}, {})
	const cards = []
	for (card in _cards) {
		const ary = new Array(2)
		const photos = _cards[card]._photos.map(obj => obj.url)
		const pay = _cards[card]._photos.every(obj => obj.pay)
		const payCount = _cards[card]._photos.map(obj => obj.pay).length
		if (!global.siteInfo) {
			await global.getSiteInfo()
		}
		cards.push({
			code: _cards[card].code,
			bindOn: _cards[card].date,
			siteId: _cards[card].siteId,
			parkName: global.siteInfo[_cards[card].siteId].parkName,
			ocrCard: global.siteInfo[_cards[card].siteId].ocrCard || false,
			faceCard: global.siteInfo[_cards[card].siteId].faceCard || false,
			type: global.siteInfo[_cards[card].siteId].type || 0,
			pageUrl: global.siteInfo[_cards[card].siteId].pageUrl,
			shareLink: `https://web.pictureair.com/?src=pictureaircard&vid=${_cards[card].code}`,
			bgUrl: global.siteInfo[_cards[card].siteId].bgUrl,
			barUrl: global.siteInfo[_cards[card].siteId].barUrl,
			photoCount: _cards[card]._photos.length,
			allowPay: !pay,
			payCount: payCount,
			photos: _cards[card]._photos.length == 1 ? ary.fill(photos[0]) : photos.slice(0, 2)
		})
	}
	return cards
}

exports.groupPhotos = async(code, bindOn) => {
	const cards = []
	const groups = await model.photo.aggregate([{
		$match: {
			'customerIds.code': code
		}
	}, {
		$group: {
			_id: {
				siteId: "$siteId",
				shootOn: {
					$substr: ["$shootOn", 0, 10]
				}
			},
			photoCount: {
				$sum: 1
			}
		}
	}])
	if (!global.siteInfo) {
		await global.getSiteInfo()
	}
	if (!groups.length) {
		return [{
			code: code,
			bindOn: moment(new Date(bindOn)).format('YYYY.MM.DD'),
			siteId: 'pictureair',
			parkName: 'PictureAir',
			ocrCard: false,
			faceCard: false,
			type: 0,
			pageUrl: '',
			shareLink: `https://web.pictureair.com/?src=pictureaircard&vid=${code}`,
			bgUrl: '',
			barUrl: '',
			photoCount: 0,
			allowPay: false,
			payCount: 0,
			photos: []
		}]
	}
	for (let group of groups) {
		cards.push(this.getGroupInfo(group, code))
	}
	await Promise.all(cards)
	for (let i in cards) {
		cards[i] = await cards[i]
	}
	return cards
}

exports.getGroupInfo = async(group, code) => {
	const card = {
		code: code,
		bindOn: moment(group._id.shootOn).format('YYYY.MM.DD'),
		siteId: group._id.siteId,
		parkName: global.siteInfo[group._id.siteId].parkName,
		ocrCard: global.siteInfo[group._id.siteId].ocrCard || false,
		faceCard: global.siteInfo[group._id.siteId].faceCard || false,
		type: global.siteInfo[group._id.siteId].type || 0,
		pageUrl: global.siteInfo[group._id.siteId].pageUrl,
		shareLink: `https://web.pictureair.com/?src=pictureaircard&vid=${code}`,
		bgUrl: global.siteInfo[group._id.siteId].bgUrl,
		barUrl: global.siteInfo[group._id.siteId].barUrl,
		photoCount: group.photoCount,
	}

	if (group.photoCount) {
		const photosPromise = model.photo.find({
			shootOn: {
				$gte: new Date(group._id.shootOn),
				$lt: new Date(new Date(group._id.shootOn).getTime() + 86400000)
			},
			'customerIds.code': code,
			siteId: group._id.siteId
		}, {
			_id: 0,
			'thumbnail.x512.url': 1
		}).sort({
			shootOn: -1
		}).limit(2)
		const payCountPromise = model.photo.count({
			shootOn: {
				$gte: new Date(group._id.shootOn),
				$lt: new Date(new Date(group._id.shootOn).getTime() + 86400000)
			},
			'customerIds.code': code,
			siteId: group._id.siteId,
			$or: [{
				'orderHistory.0': {
					$exists: true
				}
			}, {
				isFree: true
			}]
		})
		let [photos, payCount] = await Promise.all([photosPromise, payCountPromise])
		card.payCount = payCount
		card.allowPay = payCount == group.photoCount ? false : true
		card.photos = photos.length > 1 ? photos.map(obj => obj.thumbnail.x512.url) : [photos[0].thumbnail.x512.url, photos[0].thumbnail.x512.url]
	} else {
		card.allowPay = false
		card.payCount = 0
		card.photos = []
	}
	return card
}

exports.formatPhotos = async(siteId, photos) => {
	photos.map(photo => {
		const pay = orderHistory[0] ? true : false
		let wMP4 = null
		let originalInfo = null
		let thumbnail = null

		if (photo.mimeType == 'mp4') {
			thumbnail = {
				x512: {
					width: photo.thumbnail.x512.width,
					height: photo.thumbnail.x512.height,
					url: photo.thumbnail.x512.url
				},
				x1024: {}
			}
			originalInfo = {}
			wMP4 = {
				url: pay ? photo.originalInfo.url : photo.thumbnail.x1024.url
			}
		}
		if (photo.mimeType == 'jpg') {
			let selectType = pay ? 'x1024' : 'w1024'
			thumbnail = {
				x512: {
					width: photo.thumbnail.x512.width,
					height: photo.thumbnail.x512.height,
					url: photo.thumbnail.x512.url
				},
				x1024: {
					width: photo.thumbnail[selectType].width,
					height: photo.thumbnail[selectType].height,
					url: photo.thumbnail[selectType].url
				}
			}
			originalInfo = pay ? {
				url: photo.originalInfo.url,
				width: photo.originalInfo.width,
				height: photo.originalInfo.height,
				originalName: photo.originalInfo.originalName
			} : {}
			wMP4 = {}
		}
		return {
			_id: photo._id,
			siteId: siteId,
			locationId: photo.locationId,
			shootOn: photo.shootOn,
			isFree: photo.isFree,
			isPaid: pay,
			parkName: global.siteInfo[_cards[card].siteId].parkName,
			mimeType: photo.mimeType,
			wMP4: wMP4,
			thumbnail: thumbnail,
			originalInfo: originalInfo,
		}
	})
}

exports.saveToOSS = async(bucketName, name, buffer) => {
	store.useBucket(bucketName)
	const rs = await store.put(name, buffer, {
		timeout: 120000
	})
	return rs.name
}