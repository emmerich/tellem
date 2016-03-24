module.exports = function() {
	switch(process.env.TELLEM_ENV) {
		case 'dev':
			return {
				db: 'mongodb://localhost:27017/tellem',
				env: 'dev',
				port: 8080
			};
		case 'prod':
			return {
				db: 'mongodb://localhost:27017/tellem',
				env: 'prod',
				port: 8080
			};
		default:
			throw 'Unknown environment: ' + env;
	}
};