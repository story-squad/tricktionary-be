type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface GameRound {
  word_id: number;
  number_players: number;
}

export function validateRound(roundObj: any): Result<GameRound> {
  if (typeof roundObj.word_id !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof roundObj.word_id}`
    };
  }
  if (typeof roundObj.number_players !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof roundObj.word_id}`
    };
  }
  return { ok: true, value: roundObj };
}