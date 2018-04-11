const crypto = require('crypto')

const md5 = str => {
	var MD5 = crypto.createHash('md5')
	MD5.update(str)
	str = MD5.digest('hex')
	return str
}

for (let i = 0; i < 10; i++ ) {
	console.log(md5('cxaaaaaaa.jpg'))
}