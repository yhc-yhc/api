module.exports = {
	faceId: {type: String, index: true, required: true},
	disabled: {type: Boolean, default: false, index: true},
	bindDate: {type: Date, default: new Date()}, //siteId_YYYY/MM/DD_Code
	bindCode: {type: String, require: true},
	bindSiteId: {type: String, require: true}
}