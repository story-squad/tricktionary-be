// rename the "Played" table to "Score"

exports.up = function (knex) {
  return knex.schema.renameTable("Definitions", "definitions");
};

exports.down = function (knex) {
  return knex.schema.renameTable("definitions", "Definitions");
};
