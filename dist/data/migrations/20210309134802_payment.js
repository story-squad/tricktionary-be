exports.up = function (knex) {
  return knex.schema.createTable("Payment", (tbl) => {
    tbl.uuid("id").primary();
    tbl
      .uuid("member_id")
      .notNullable()
      .references("Member.id")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.integer("amount");
    tbl.string("external", 1024); // external payment processing information (Stripe)
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Payment");
};
