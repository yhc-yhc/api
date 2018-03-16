module.exports = {
	name: {type: [String], index: true, required: true},
	url: {type: [String], required: true},
	disabled: {type: Boolean, default: false, index: true},
	feature: {type: [String], required: true}
}