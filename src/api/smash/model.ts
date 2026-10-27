import db from "../../dbConfig";

export { addReaction, getTotals };

/** the ids that name one reaction total: a reaction to a definition in a round */
type SmashKey = {
  game_id: string;
  round_id: number;
  definition_id: number;
  reaction_id: number;
};

/** one reaction total, as /api/smash/totals replies with it */
export type SmashTotal = SmashKey & { value: number; count: number };

/**
 * Count one reaction in the Smash table, the record of reaction totals, and
 * return the new total for it.
 *
 * Reactions to the same definition arrive together, so the read and the write
 * run in one transaction holding a lock on the key (released when the
 * transaction ends); without it, two first reactions could both insert a row.
 * Should a key already have more than one row (the earlier cache-to-database
 * copy could write one twice), the row with the largest count is the total,
 * and that row is the one incremented.
 */
async function addReaction(
  game_id: string,
  round_id: number,
  definition_id: number,
  reaction_id: number
): Promise<number> {
  const key: SmashKey = { game_id, round_id, definition_id, reaction_id };
  return await db.transaction(async (trx: any) => {
    await trx.raw("select pg_advisory_xact_lock(hashtext(?))", [
      `Smash:${game_id}:${round_id}:${definition_id}:${reaction_id}`,
    ]);
    const row = await trx("Smash")
      .where(key)
      .orderBy([{ column: "count", order: "desc" }, "id"])
      .first();
    if (row?.id) {
      await trx("Smash").where({ id: row.id }).increment("count", 1);
      return Number(row.count || 0) + 1;
    }
    await trx("Smash").insert({ ...key, count: 1 });
    return 1;
  });
}

/**
 * The reaction totals of a round, from the Smash table: one entry per
 * definition and reaction, sorted by definition, then reaction. When rows
 * repeat a key, the largest count is the total; a total of zero is left out.
 *
 * @returns [{ game_id, round_id, definition_id, reaction_id, value, count }],
 * where value and count are the same total
 */
async function getTotals(game_id: string, round_id: number): Promise<SmashTotal[]> {
  const rows: any[] = await db("Smash").where({ game_id, round_id });
  const totals = new Map<string, SmashTotal>();
  for (const row of rows) {
    const name = `${row.definition_id}-${row.reaction_id}`;
    const total = totals.get(name) || {
      game_id: row.game_id,
      round_id: Number(row.round_id),
      definition_id: Number(row.definition_id),
      reaction_id: Number(row.reaction_id),
      value: 0,
      count: 0,
    };
    total.value = Math.max(total.value, Number(row.count || 0));
    total.count = total.value;
    totals.set(name, total);
  }
  return [...totals.values()]
    .filter((total) => total.value > 0)
    .sort(
      (a, b) => a.definition_id - b.definition_id || a.reaction_id - b.reaction_id
    );
}
