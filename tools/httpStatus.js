module.exports = {
	notFound: {
		status: 404,
		message: 'url not found or method error'
	},
	errorLoss: {
		status: 5001,
		message: 'not found this error msg'
	},
	paramErr: {
		status: 5002,
		message: 'param loss'
	},
	success: {
		status: 200,
		message: 'success'
	},
	2222: {
		a: 1
	},
	'/user/sendsms': {
		'GET': {
			params: {
				phone: 1,
				code: 1
			},
			error: {
				smsSending: {
					status: 425,
					message: 'sms sending'
				}
			}
		}

	}
}