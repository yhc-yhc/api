require('../common/global.js')

function fillLen(v, len) {
	if (v && new Buffer(v.toString()).length > len) {
		return Buffer(v.toString()).slice(0, len).toString()
	}
	if (v || v == 0) {
		for (let i = new Buffer(v.toString()).length; i < len; i++) {
			v = '0' + v
		}
		return v
	}
	let str = ''
	for (var i = 0; i < len; i++) {
		str += ' '
	}
	return str
}
exports.createCardCodes = (siteId, type, count, expiredOn) => {
	const obj = {}
	const codes = []
	const dayStr = moment(expiredOn, 'YYYYMMDD').format('YYYY-MM-DD')
	const n2 = idGenerate(alphabet, 2)
	const countLen = new Buffer(count.toString()).length
	const _sn = n2 + idGenerate(alphabet, 10 - countLen)
	for (let i = 0; i < count; i++) {
		let sn = _sn + fillLen(i + 1, countLen)
		let cardNo = `${siteId}-${type}`
		cardNo += idGenerate(alphabet, 4 - type.length)
		cardNo += '-' + idGenerate(alphabet, 4) + '-' + n2
		cardNo += idGenerate(alphabet, 19 - cardNo.length)
		if (!obj[cardNo]) {
			obj[cardNo] = 1
		} else {
			continue
		}
		codes.push([cardNo, cardNo.replace(/-/g, ''), sn, dayStr])
			// log([cardNo, cardNo.replace(/-/g, ''), sn, dayStr])
	}
	return codes
}

exports.createCodeFile = async(codes, fileName) => {
	for (code of codes) {
		fse.appendFileSync(fileName, `${code[0]}  ${code[1]}  ${code[2]}  ${code[3]} \n`)
	}
	return true
}

exports.saveCodesToDB = async(codes, type, siteIds) => {
	const _codes = codes.map(code => ({
		PPPCode: code[1],
		SN: code[2],
		PPPType: type,
		oType: type,
		siteIds: siteIds,
		days: 1,
		expiredDay: 1,
		expiredOn: new Date(code[3]),
		active: false,
		createdOn: new Date(),
		createdBy: 'system-josh',
	}))
	const rs = await model.cardCode.create(_codes)
	return true
}

exports.sendFileEmail = async (siteId, fileName) => {
	const email_content = `Dear all,<br>
  		Kindly find the attachments for that card codes you generated to ${siteId} in ${process.env.RUN || 'dev'} environment. <br>
	thanks<br>`
	const data = {
		from: `<do-not-reply@disneyphotopass.com.hk>`,
		to: `<zhaoyi@pictureworks.biz>`,
		bcc: `<josh.zhu@pictureworks.biz>`,
		subject: `Card Codes Files`,
		html: email_content,
		attachments: [{
			filename: fileName,
			path: fileName
		}]
	}
	const smtpTransport = nodemailer.createTransport({
		host: "smtp.office365.com",
		port: 587,
		ssl: false,
		auth: {
			user: 'do-not-reply@disneyphotopass.com.hk',
			pass: 'CN-SH-PA-6001'
		}
		// pool: true,
		// host: 'smtp.office365.com',
		// port: 587,
		// secure: false,
		// auth: {
		// 	user: 'do-not-reply@pictureair.com',
		// 	pass: 'CN-SH-PA-6001'
		// },
		// maxConnections: 10,
		// maxMessages: 1000
	})
	return new Promise((resolve, reject) => {
		smtpTransport.sendMail(data, function(err, res) {
			if (err) {
				console.log(err)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}