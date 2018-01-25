module.exports = async (areaCode, mobile, tplMap, contentAry) => {
	let random = parseInt(Math.random() * 10000000000)
	let time = parseInt(Date.now() / 1000)
	let presign = `appkey=${config.sms.appkey}&random=${random}&time=${time}&mobile=${mobile}`
	let sig = crypto.createHash('sha256').update(presign, 'utf-8').digest('hex')
	// log(config.sms.tpl_sign, areaCode, config.sms.tpl_sign[areaCode], tplMap)
	const body = {
		tel: {
			nationcode: areaCode,
			mobile: mobile
		},
		sign: config.sms.tpl_sign[areaCode] || config.sms.tpl_sign.orthers,
		tpl_id: tplMap[areaCode] || tplMap.orthers,
		params: contentAry,
		sig: sig,
		time: time,
		extend: '',
		ext: ''
	}
	// log(body)
	return await request.postAsync({
		url: `${config.sms.url}?sdkappid=${config.sms.sdkappid}&random=${random}`,
		body: body,
		json: true
	})
}
