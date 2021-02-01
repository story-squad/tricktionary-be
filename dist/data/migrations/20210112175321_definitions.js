exports.up = function (knex) {
  return knex.schema.createTable("Definitions", (tbl) => {
    tbl.increments("id");
    tbl.string("user_id", 255).notNullable();
    tbl.string("definition", 255).notNullable();
    tbl
      .integer("round_id")
      .unsigned()
      .notNullable()
      .references("Rounds.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Definitions");
};
