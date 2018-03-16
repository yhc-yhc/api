module.exports = {
	name: {type: String, index: true, required: true},
	url: {type: String, required: true},
	disabled: {type: Boolean, default: false, index: true},
	bindInfo: {type: [String], default: []}, //siteId_YYYY/MM/DD_Code
	feature: {type: String, required: true}
}