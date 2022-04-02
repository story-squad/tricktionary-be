var dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "./ca-certificate.crt")),
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "./ca-certificate.crt")),
    },
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
  },
};
