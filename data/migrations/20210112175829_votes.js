exports.up = function (knex) {
  return knex.schema.createTable("Votes", (tbl) => {
    tbl.increments("id");
    tbl.string("user_id", 255).notNullable();
    tbl
      .integer("definition_id")
      .unsigned()
      .references("Definitions.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("round_id")
      .unsigned()
      .references("Rounds.id")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Votes");
};
