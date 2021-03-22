// rename the "Played" table to "Score"

exports.up = function (knex) {
  return knex.schema.renameTable("Played", "score");
};

exports.down = function (knex) {
  return knex.schema.renameTable("score", "Played");
};
