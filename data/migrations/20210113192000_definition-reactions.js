
exports.up = function(knex) {
  return knex.schema.createTable("Definition-Reactions", (tbl) => {
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
      .notNullable()
      .references("Reactions.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("definition_id")
      .unsigned()
      .notNullable()
      .references("Definitions.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.boolean("game_finished").defaultTo(false);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Definition-Reactions")
};
