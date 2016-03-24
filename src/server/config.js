var winston = require('winston');

module.exports = function() {
	switch(process.env.TELLEM_ENV) {
		case 'dev':
			return {
				db: 'mongodb://localhost:27017/tellem',
				env: 'dev',
				port: 8080,
				client_id: '56f415c28fc1106971a3c8db',
				devOps_id: '56f415c28fc1106971a3c8dc'
			};
		case 'prod':
			return {
				db: 'mongodb://localhost:27017/tellem',
				env: 'prod',
				port: 8080,
				client_id: '',
				devOps_id: ''
			};
		default:
			throw 'Unknown environment: ' + env;
	}
};