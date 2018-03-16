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

// let urlstr = 'photos/20170524/bu1/enPreview/BU1_bu1-9990-88888888-103927-03664303_BuzzRideGreenMan6r.jpg';
// console.log(enurl(urlstr))

// let str1 = '69210efcb90eb8598438a396fab77b07c5ffec74e89a28d66669197004f1fd0685d02ac89a318efa5e81889fa4231816cae9118879ac31708ad793b8c6e60943561b1c097230757f0a75fd527f26666c69022de6da6328f40b709b5277017ef9';
// console.log(deurl(str1))
// console.log(deurl(enurl(urlstr)))

module.exports = {
	enurl,
	deurl
}