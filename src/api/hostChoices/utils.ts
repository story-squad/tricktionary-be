type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface HostChoice {
  word_id_one: number;
  word_id_two: number;
  round_id: number;
  times_shuffled: number;
}

export function validateHostChoice(hostChoiceObj: any): Result<HostChoice> {
  if (typeof hostChoiceObj.word_id_one !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof hostChoiceObj.word_id_one}`,
    };
  }
  if (typeof hostChoiceObj.word_id_two !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof hostChoiceObj.word_id_two}`,
    };
  }
  if (typeof hostChoiceObj.round_id !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof hostChoiceObj.round_id}`,
    };
  }
  if (typeof hostChoiceObj.times_shuffled !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof hostChoiceObj.times_shuffled}`,
    };
  }
  return { ok: true, value: hostChoiceObj }; // as-is
}
