exports.photosToCards = async photos => {
	const codePhotos = []
	photos.forEach(photo => {
		const cusCode = photo.customerIds.map(obj => obj.code)
		const _codes = []
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
		cards.push({
			code: _cards[card].code,
			date: _cards[card].date,
			siteId: _cards[card].siteId,
			photoCount: _cards[card]._photos.length,
			photos: _cards[card]._photos.length == 1 ? ary.fill(photos[0]) : photos.slice(0, 2),
			pay: pay,
			payCount: payCount
		})
	}
	return cards
}