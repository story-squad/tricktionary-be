const tableName = "words";
// alter score table to include timestamps & points
exports.up = async function (knex) {
  await knex.schema.alterTable(tableName, function (tbl) {
    // add timestamps
    tbl.timestamps(false, true);
    tbl.string("format", 255).defaultTo("word");
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
    tbl.dropColumns(["format"]);
  });
};
