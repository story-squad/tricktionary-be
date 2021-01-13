import knex from "knex";

interface KnexConfig {
  [key: string]: object;
};

import * as knexfile from "../knexfile";

const config = knexfile as KnexConfig;

const environment = process.env.DB_ENVIRONMENT || "development";

export default knex(config[environment]);
