type Result<T> = { ok: true; value: T } | { ok: true; value: null } | {ok: false; message: string};

interface ExpectedVote {
  user_id: string;
  definition_id: string | null;
  round_id: number;
}

export function validateVote(voteObj: any): Result<ExpectedVote> {
  if (typeof voteObj.user_id !== "string") {
    return {
      ok: false,
      message:  `must be of type string, received ${typeof voteObj.user_id}`
    }
  }
  if (typeof voteObj.round_id !== "number") {
    return {
      ok: false,
      message:  `must be of type number, received ${typeof voteObj.round_id}`
    }
  }
  // usable
  if (typeof voteObj.definition_id !== "string") {
    return {
      ok: true,
      value: {...voteObj, definition_id: null} // nullified
    }
  }
  return {
    ok: true,
    value: voteObj // as is
  }
}