exports.up = function (knex) {
  return knex.schema.createTable("User-Rounds", (tbl) => {
    tbl.increments("id");
    tbl.string("user_id", 255).notNullable();
    tbl
      .integer("round_id")
      .unsigned()
      .notNullable()
      .references("Rounds.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("reaction_id")
      .unsigned()
      .references("Reactions.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("User-Rounds");
};
