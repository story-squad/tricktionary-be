exports.up = function (knex) {
    return knex.schema.createTable("host-choices", (tbl) => {
        tbl.increments('id');
        tbl
            .integer("word_id_one")
            .unsigned()
            .notNullable()
            .references("Words.id")
            .onDelete("RESTRICT")
            .onUpdate("Cascade");
        tbl
            .integer("word_id_two")
            .unsigned()
            .notNullable()
            .references("Words.id")
            .onDelete("RESTRICT")
            .onUpdate("Cascade");
        tbl
            .integer("round_id")
            .unsigned()
            .notNullable()
            // These are commented out bc there are no round seeds. Need to add back on production
            .references("Rounds.id")
            .onDelete("RESTRICT")
            .onUpdate("CASCADE");
        tbl.integer("times_shuffled").notNullable()
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("host-choices");
};