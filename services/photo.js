const oss = require('ali-oss').Wrapper
const store = oss({
	accessKeyId: 'LTAIamKqehuCllfX',
	accessKeySecret: '6sr2fdtUJHQK1GaKJdjY1JDNg94YrM',
	region: process.env.RUN == 'product' ? 'oss-cn-hongkong' : 'oss-cn-shanghai',
	timeout: 120000

})

exports.groupPhotos = async (code, bindOn) => {
	let cards = []
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
		let type = 0
		for (let siteId in siteInfo) {
			if (siteInfo[siteId].parkCardCode == code)	type = 1
		}
		return [{
			code: code,
			bindOn: moment(new Date(bindOn)).format('YYYY.MM.DD'),
			siteId: 'pictureair',
			parkName: 'PictureAir',
			ocrCard: false,
			faceCard: false,
			type: type,
			pageUrl: 'http://web.pictureair.com/',
			shareLink: `https://web.pictureair.com/?src=pictureaircard&vid=${code}`,
			bgUrl: '/sites/common/background.png',
			barUrl: '/sites/common/background.png',
			photoCount: 0,
			allowPay: false,
			payCount: 0,
			photos: []
		}]
	}
	for (let group of groups) {
		cards.push(this.getGroupInfo(group, code))
	}
	cards = await Promise.all(cards)
	return cards
}

exports.getGroupInfo = async (group, code) => {
	const card = {
		code: code,
		bindOn: moment(group._id.shootOn).format('YYYY.MM.DD'),
		siteId: group._id.siteId,
		parkName: global.siteInfo[group._id.siteId].parkName,
		ocrCard: global.siteInfo[group._id.siteId].ocrCard || false,
		faceCard: global.siteInfo[group._id.siteId].faceCard || false,
		type: siteInfo[group._id.siteId].parkCardCode == code ? 1 : 0,
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
			'thumbnail.x1024.url': 1
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
		card.photos = photos.length > 1 ? photos.map(obj => obj.thumbnail.x1024.url || '') : [photos[0].thumbnail.x1024.url || '', photos[0].thumbnail.x1024.url || '']
	} else {
		card.allowPay = false
		card.payCount = 0
		card.photos = []
	}
	return card
}

exports.formatPhotos = async (siteId, photos) => {
	const ary = []
	for (let photo of photos) {
		let pay = false
		if (photo.orderHistory[0]) pay = true
		if (photo.isFree) pay = true
		let wMP4 = null
		let originalInfo = null
		let thumbnail = null
		photo.mimeType = photo.mimeType || 'jpg'
		if (photo.mimeType == 'mp4') {
			thumbnail = {
				x512: {
					width: photo.thumbnail.x512.width,
					height: photo.thumbnail.x512.height,
					url: photo.thumbnail.x512.url
				},
				x1024: {
					width: photo.thumbnail.x512.width,
					height: photo.thumbnail.x512.height,
					url: photo.thumbnail.x512.url
				}
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
		if (!siteInfo) {
			await getSiteInfo()
		}
		ary.push({
			_id: photo._id,
			siteId: siteId,
			locationId: photo.locationId,
			shootOn: photo.shootOn,
			isFree: photo.isFree,
			isPaid: pay,
			parkName: siteInfo[siteId].parkName,
			mimeType: photo.mimeType,
			wMP4: wMP4,
			thumbnail: thumbnail,
			originalInfo: originalInfo,
		})
	}
	return ary
}

exports.saveToOSS = async (bucketName, name, buffer) => {
	store.useBucket(bucketName)
	const rs = await store.put(name, buffer, {
		timeout: 120000
	})
	return rs.name
}