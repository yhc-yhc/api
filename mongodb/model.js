const schemas = loaddir('mongodb/schema/');
const conn = require('./conn.js')

// log(schemas)
const Model = {}
for (let name in schemas) {
	// log(name)
	const schema = new mongoose.Schema(schemas[name])
	const model = conn.model(name, schema)
	Model[name] = model
}
module.exports = Model;