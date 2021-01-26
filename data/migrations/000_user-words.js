// pending words, player words... prior to moderation. 
exports.up = function (knex) {
  return knex.schema.createTable("User-Words", (tbl) => {
    tbl.increments("id");
    tbl.string("word", 1000).notNullable().unique();
    tbl.string("definition", 1000).notNullable();
    tbl.integer("score").unsigned().defaultTo(0);
    tbl.boolean("approved").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("User-Words");
};
