const tableName = "definitions";
// alter score table to include timestamps & points
exports.up = async function (knex) {
  await knex.schema.alterTable(tableName, function (tbl) {
    // add timestamps
    tbl.timestamps(false, true);
    // add points
    tbl.integer("score").defaultTo(0);
    tbl
      .uuid("player_id") // the foreign key must be the same type as the primary key it references
      .references("id")
      .inTable("Player")
      .onUpdate("CASCADE") // what happens if the value of the primary key changes
      .onDelete("CASCADE"); // what happens if the primary key table row is deleted
    tbl
      .uuid("game_id") // the foreign key must be the same type as the primary key it references
      .references("id")
      .inTable("Game")
      .onUpdate("CASCADE") // what happens if the value of the primary key changes
      .onDelete("CASCADE"); // what happens if the primary key table row is deleted
  });

  await knex.raw(`
      CREATE TRIGGER update_timestamp
      BEFORE UPDATE
      ON ${tableName}
      FOR EACH ROW
      EXECUTE PROCEDURE update_timestamp();`);
};

exports.down = async function (knex) {
  await knex.schema.alterTable(tableName, function (tbl) {
    tbl.dropTimestamps();
    tbl.dropColumns(["score", "player_id", "game_id"]);
  });
};
