type Result<T> = { ok: true; value: T } | { ok: false; message: string };

export interface DefinitionObject {
  user_id: string;
  definition: string | null;
  round_id: number;
}

export type DefinitionType = {
  id?: number,
  user_id: string;
  definition: string | null;
  round_id: number;
}

export function validateDefinition(definitionObj: any): Result<DefinitionObject> {
  if (typeof definitionObj.user_id !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof definitionObj.user_id}`
    };
  }
  if (typeof definitionObj.round_id !== "number") {
    return {
      ok: false,
      message: `must be of type number, received ${typeof definitionObj.round_id}`
    };
  }
  if (typeof definitionObj.definition !== "string") {
    // should we return an error message instead ?
    return {
      ok: true,
      value: { ...definitionObj, definition: null } // nullified
    };
  }
  return { ok: true, value: definitionObj }; // as-is
}
