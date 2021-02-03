exports.up = function (knex) {
  return knex.schema.createTable("Played", (tbl) => {
    tbl.uuid("id").primary();
    tbl
      .uuid("player_id") // the foreign key must be the same type as the primary key it references
      .references("id")
      .inTable("Player")
      .onUpdate("CASCADE") // what happens if the value of the primary key changes
      .onDelete("CASCADE"); // what happens if the primary key table row is deleted
    // RESTRICT, DO NOTHING, SET NULL, CASCADE
    tbl
    .uuid("game_id") // the foreign key must be the same type as the primary key it references
    .references("id")
    .inTable("Game")
    .onUpdate("CASCADE") // what happens if the value of the primary key changes
    .onDelete("CASCADE"); // what happens if the primary key table row is deleted
  // RESTRICT, DO NOTHING, SET NULL, CASCADE
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Played");
};
