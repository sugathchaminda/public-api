const config = {
  client: 'pg',
  connection: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT
  },
  pool: { min: 1, max: 50 },
  acquireConnectionTimeout: 10000,
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

module.exports = config;
