const tableName = "score";
// alter score table to include timestamps & points
exports.up = async function (knex) {
	await knex.schema.alterTable(tableName, function (tbl) {
		tbl.timestamps(false, true);
		tbl.integer('points').defaultTo(0);
		tbl
		.integer("top_definition_id")
		.unsigned()
		.references("Definitions.id")
		.onDelete("CASCADE")
		.onUpdate("CASCADE");
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
		tbl.dropColumns(['points', 'top_definition_id']);
	});
};
