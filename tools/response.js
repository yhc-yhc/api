module.exports.resFomat = (status, message, data) => {
	const obj =  {
		status: status,
		message: message
	}
	if (data) obj.result = data
	return obj
}