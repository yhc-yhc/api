module.exports = {
	name: {type: String, index: true, required: true},
	url: {type: String, required: true},
	disabled: {type: Boolean, default: false, index: true},
	active: {type: Date, default: new Date()},//人脸最新活动时间
	bindInfo: {type: [String], default: []}, //siteId_YYYY/MM/DD_Code
	feature: {type: String, required: true}
}