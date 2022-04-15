// typed mirror image of knexfile.js

import dotenv from "dotenv";

dotenv.config();

interface KnexConfig {
  [key: string]: object;
}

const knexConfig: KnexConfig = {
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
      connectionString:
        process.env.DATABASE_URL !== undefined
          ? process.env.DATABASE_URL.replace("?sslmode=require", "")
          : process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
  },
};

module.exports = knexConfig;
