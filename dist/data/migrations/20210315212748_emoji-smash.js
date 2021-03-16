exports.up = function (knex) {
  return knex.schema.createTable("Smash", (tbl) => {
    tbl.increments("id");
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl
      .uuid("game_id")
      .references("Game.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("round_id")
      .unsigned()
      .notNullable()
      .references("Rounds.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("definition_id")
      .unsigned()
      .references("Definitions.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("reaction_id")
      .unsigned()
      .notNullable()
      .references("Reactions.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.integer("count").defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Smash");
};
