
exports.up = function (knex) {
  return knex.schema.table("User-Rounds", (tbl) => {
    tbl
      .uuid("game_id")
      .references("Game.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.boolean("chose_correct"); // point gained from choosing correcct definition this round?
    tbl.integer("votes"); // point(s) gained from other players this round.
    tbl.boolean("is_host"); // player hosted this round.
  });
};

exports.down = function (knex) {
  return knex.schema.table("User-Rounds", (tbl) => {
    tbl.dropColumn("is_host");
    tbl.dropColumn("votes");
    tbl.dropColumn("chose_correct");
    tbl.dropColumn("game_id");
  });
};
