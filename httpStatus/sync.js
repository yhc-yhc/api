module.exports = {
	syncToCloud: {
		method: 'POST',
		desc: "把线下的照片数据同步到云端",
		headers: {},
		params: {
			photo: [1, 'Object', 'photo doc data'],
			L: [1, 'String', 'x1024 base64'],
			O: [1, 'String', 'original base64'],
			W1024: [1, 'String', 'w1024 base64']
		},
		resDesc: {}
	},
	syncOrder: {
		method: 'POST',
		desc: "把线下的订单数据同步到云端",
		headers: {},
		params: {
			order: [1, 'Object', 'order doc data']
		},
		resDesc: {}
	},
	syncScanPPHistory: {
		method: 'POST',
		desc: "把线下的扫描卡数据同步到云端",
		headers: {},
		params: {
			syncScanPPHistory: [1, 'Object', 'syncScanPPHistory doc data']
		},
		resDesc: {}
	}
}