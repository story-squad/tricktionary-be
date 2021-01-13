// typed mirror image of knexfile.js

import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/.env` });

interface KnexConfig {
  [key: string]: object;
};

const knexConfig:KnexConfig = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./data/migrations", extension: 'ts' },
    seeds: { directory: "./data/seeds" },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
  },
};

module.exports = knexConfig;
