
exports.up = function(knex) {
  return knex.schema.createTable("Reactions", (tbl) => {
    tbl.increments("id");
    tbl.string("content").notNullable().unique();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("Reactions")  
};
