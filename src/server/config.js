module.exports = function() {
	switch(process.env.TELLEM_ENV) {
		case 'dev':
			return {
				db: 'mongodb://localhost:27017/tellem',
				env: process.env.TELLEM_ENV
			};
		case 'prod':
			return {
				db: 'mongodb://localhost:27017/tellem',
				env: process.env.TELLEM_ENV
			};
		default:
			throw 'Unknown environment: ' + env;
	}
};