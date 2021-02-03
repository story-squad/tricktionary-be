exports.up = function (knex) {
  return knex.schema.createTable("Player", (tbl) => {
    tbl.uuid("id").primary();
    tbl.string("token", 1024).defaultTo("generate me"); // JSON Web Token handles the session security
    tbl.string("last_played", 255).defaultTo("update me"); // uuid of last known game 
    tbl.string("last_user_id", 255).defaultTo("update me"); // last known user.id (web socket.id)
    tbl.string("jump_code", 255).defaultTo(null); // jump from one device to another and re-join your session.
    tbl.string("name", 255).defaultTo(null);
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Player");
};
