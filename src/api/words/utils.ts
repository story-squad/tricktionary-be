type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface WordObject {
  word: string;
  definition: string;
  source: string | undefined;
  moderated: boolean | undefined;
  approved: boolean | undefined;
}

export function validateWord(wordObj: any): Result<WordObject> {
  // word must be a string and cannot be empty
  const skel = { word: undefined, definition: undefined, source: undefined, moderated: false, approved: false }
  const value = { ...skel, ...wordObj}
  if (typeof value.word !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof value.word}`
    };
  }
  // word must be a string and cannot be empty
  if (typeof value.definition !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof value.definition}`
    };
  }

  return { ok: true, value };
}

export function range(n:number) {
  return Array.from(Array(n).keys());
}

/**
 * is this a number ?
 * @param num string
 *
 * this function exists because typeof(NaN) === "number"; wtfJS!?
 *
 */
export function validNumber(num:any) {
  try {
    const pattern = /[0-9]/g;
    const result = num.match(pattern)
    const n:string = result?.length > 0 && result?.length === num?.length ? result.join("") : "";
    return n.length > 0;
  } catch (err:any){
    return false
  }
}