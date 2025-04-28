import path from 'path';

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root('.env'),
	sample: root('.env.example'),
});

const ENV = process.env;

const config = {
	PORT: ENV.PORT ?? 4000,
	MONGO_FULL_URI: ENV.MONGO_FULL_URI ?? '',
	MONGO_URI: ENV.MONGO_URI ?? '',
	MONGO_DB_NAME: ENV.MONGO_DB_NAME ?? '',
	HASH_SALT: ENV.HASH_SALT ?? 10,
};

export { config };
