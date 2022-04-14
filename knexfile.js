var dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "pg",
    connection: {
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOSTNAME,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERT,
      },
    },
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
  },
};
