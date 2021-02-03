exports.up = function (knex) {
  return knex.schema.createTable("Game", (tbl) => {
    tbl.uuid("id").primary();
    tbl.timestamp("created_at").defaultTo(knex.fn.now()); // PREGAME
    tbl.string("og_host", 255).notNullable(); // player who started the game
    tbl.timestamp("ended_at").defaultTo(null);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Game");
};
