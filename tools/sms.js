module.exports = async (mobilePrefix, mobile, tplMap, contentAry) => {
	let random = parseInt(Math.random() * 10000000000)
	let time = parseInt(Date.now() / 1000)
	let presign = `appkey=${config.sms.appkey}&random=${random}&time=${time}&mobile=${mobile}`
	let sig = crypto.createHash('sha256').update(presign, 'utf-8').digest('hex')
	const body = {
		tel: {
			nationcode: mobilePrefix,
			mobile: mobile
		},
		sign: config.sms.tpl_sign[mobilePrefix] || config.sms.tpl_sign.orthers,
		tpl_id: tplMap[mobilePrefix] || tplMap.orthers,
		params: contentAry,
		sig: sig,
		time: time,
		extend: '',
		ext: ''
	}
	return await request.postAsync({
		url: `${config.sms.url}?sdkappid=${config.sms.sdkappid}&random=${random}`,
		body: body,
		json: true
	})
}
