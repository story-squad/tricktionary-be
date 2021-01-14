type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface DefinitionReaction {
  user_id: string;
  round_id: number;
  reaction_id: number;
  definition_id: number;
  game_finished: boolean;
}

export function validateDefinitionReaction(
  drObject: any
): Result<DefinitionReaction> {
  if (typeof drObject.user_id !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof drObject.user_id}`
    };
  }
  if (typeof drObject.round_id !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof drObject.round_id}`
    };
  }
  if (typeof drObject.reaction_id !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof drObject.reaction_id}`
    };
  }
  if (typeof drObject.definition_id !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof drObject.definition_id}`
    };
  }
  if (typeof drObject.game_finished !== "boolean") {
    return {
      ok: false,
      message: `must be of type boolean, received ${typeof drObject.game_finished}`
    };
  }
  return {
    ok: true,
    value: drObject
  };
}
