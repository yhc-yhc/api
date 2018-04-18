const events = new require('events')
const ev = new events.EventEmitter()
ev.setMaxListeners(0)

const cp = require('child_process')
const works = []
const flag_obj = {} 
const process_num = 1

for (let i = 0; i < process_num; i++) {
	const work = cp.fork('tools/child.js');
	work.on('message', function(m) {
		delete flag_obj[m.flag]
		ev.emit(m.flag, m.error, m.data)
	})
	works.push(work)
}

module.exports = function({flag, data}, fn) {

	if (!flag_obj[flag]) {
		flag_obj[flag] = 1
		works[0].send({flag, data})
	}
	ev.once(flag, function(err, data) {
		fn(err, data)
	})
}