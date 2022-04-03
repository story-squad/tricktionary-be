// typed mirror image of knexfile.js

import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: `${__dirname}/.env` });

interface KnexConfig {
  [key: string]: object;
}

const knexConfig: KnexConfig = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./data/migrations", extension: "ts" },
    seeds: { directory: "./data/seeds" },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "../cert/ca-certificate.crt")),
    },
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
  },
};

module.exports = knexConfig;
