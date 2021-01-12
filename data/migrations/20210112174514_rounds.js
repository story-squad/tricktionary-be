exports.up = function (knex) {
  return knex.schema.createTable("Rounds", (tbl) => {
    tbl.increments("id");
    tbl
      .integer("word_id")
      .unsigned()
      .notNullable()
      .references("Words.id")
      .onDelete("RESTRICT")
      .onUpdate("Cascade");
    tbl.integer("number_players").notNullable();
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.timestamp("ended_at").defaultTo(null);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Rounds");
};
