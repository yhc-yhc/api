module.exports = {
	success: {
		status: 200,
		message: 'success'
	},
	notFound: {
		status: 404,
		message: 'url not found or method error'
	},
	paramErr: {
		status: 5002,
		message: 'param loss'
	},
	errorLoss: {
		status: 5001,
		message: 'not found this error msg'
	},
	'/user/sendsms': {
		'POST': {
			params: {
				phone: 1,
				areaCode: 1
			},
			error: {
				smsSending: {
					status: 425,
					message: 'sms sending'
				},
				getSmsErr: {
					status: 426,
					message: 'error after server request'
				}
			}
		}
	},
	'/face/list': {
		'GET': {

		}
	},
	'/face/searchByImage': {
		'POST': {
			// params: {
			// 	file: 1
			// }
		}
	}
}