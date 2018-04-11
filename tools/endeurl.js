const crypto = require('crypto');
let KEY = "PICTUREAIR082816";
let IV = "PICTUREAIR082816";

function enurl(urlstr) {
	let encipher = crypto.createCipheriv('aes-128-cbc', KEY, IV);
	let encoded = encipher.update(urlstr, 'utf8', 'hex');
	encoded += encipher.final('hex');
	return encoded;
}

function deurl(enurlstr) {
	let decipher = crypto.createDecipheriv('aes-128-cbc', KEY, IV);
	let decoded = decipher.update(enurlstr, 'hex', 'utf8');
	decoded += decipher.final('utf8');
	return decoded;
}

const md5 = str => {
	const MD5 = crypto.createHash('md5')
	MD5.update(str)
	str = MD5.digest('hex')
	return str
}

// let urlstr = 'photos/20170524/bu1/enPreview/BU1_bu1-9990-88888888-103927-03664303_BuzzRideGreenMan6r.jpg';
// console.log(enurl(urlstr))

// let str1 = 'd4274d093e6d48afed63307dcf2d46704405da481d277007f9baa662ab4d86cd3e5e48b7efb29af3c2da86787498050e809fbcaf1ddb052b3ce0aafa0c34fcc3ba4d2da3f2d0b33b6e2c6b8285567cad19cadeb0d362f023b98febc2f08b8c7b24568392cb60db1a19a32f1ad9e33437';
// console.log(deurl(str1))
// console.log(deurl(enurl(urlstr)))

module.exports = {
	enurl,
	deurl,
	md5
}