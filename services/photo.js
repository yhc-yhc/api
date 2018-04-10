const oss = require('ali-oss').Wrapper
const store = oss({
	accessKeyId: 'LTAIamKqehuCllfX',
	accessKeySecret: '6sr2fdtUJHQK1GaKJdjY1JDNg94YrM',
	region: 'oss-cn-hongkong',

})
exports.photosToCards = async(photos, codes) => {
	const codePhotos = []
	photos.forEach(photo => {
		const cusCode = photo.customerIds.map(obj => obj.code)
		let _codes = []
		for (let code of cusCode) {
			if (codes.indexOf(code) == -1) {
				_codes.push(code)
			}
		}

		for (let code of _codes) {
			codePhotos.push({
				code: code,
				date: moment(new Date(photo.shootOn)).format('YYYY.MM.DD'),
				siteId: photo.siteId,
				url: photo.thumbnail.x512.url,
				pay: photo.orderHistory[0] ? true : false
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

exports.saveBase64Data = async (bucketName, name, buffer) => {
	const result = await store.listBuckets({prefix: bucketName})
	console.log('buckets: ', result)
	if (!result.buckets) {
		await store.putBucket(bucketName)
	}
	store.useBucket(bucketName)
	const rs = await store.put(name, buffer)
	return rs.name
}