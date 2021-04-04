exports.up = function (knex) {
  return knex.schema.alterTable("host-choices", function (tbl) {
    // remove not-nullable from host
    tbl.integer("word_id_one").nullable().alter();
    tbl.integer("word_id_two").nullable().alter();
    // remove foreign-key constraints
    tbl.dropForeign("word_id_one");
    tbl.dropForeign("word_id_two");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("host-choices", function (tbl) {
    // add not-nullable from host
    tbl.integer("word_id_one").notNullable().alter();
    tbl.integer("word_id_two").notNullable().alter();
    // add foreign-key constraints
    tbl.integer("word_id_one").references("words.id").alter();
    tbl.integer("word_id_two").references("words.id").alter();
  });
};
