// rename the "Played" table to "Score"

exports.up = function (knex) {
  return knex.schema.renameTable("Words", "words");
};

exports.down = function (knex) {
  return knex.schema.renameTable("words", "Words");
};
