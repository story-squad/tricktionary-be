exports.up = function (knex) {
  return knex.schema.createTable("Words", (tbl) => {
    tbl.increments("id");
    tbl.string("word", 1000).notNullable().unique();
    tbl.string("definition", 1000).notNullable();
    tbl.boolean("moderated").defaultTo(false);
    tbl.boolean("approved").defaultTo(false);
    tbl.string("source", 1000).defaultTo("wordnic");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Words");
};
