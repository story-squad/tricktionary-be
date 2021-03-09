exports.up = function (knex) {
  return knex.schema.createTable("Member", (tbl) => {
    tbl.uuid("id").primary();
    tbl.string("email", 255).unique();
    tbl.string("username", 255);  // preffered name to use when playing a game of Tricktionary
    tbl.string("fullname", 1024); // optional
    tbl.string("location", 1024); // optional
    tbl.string("external", 1024); // external id provider identification string;
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Member");
};
