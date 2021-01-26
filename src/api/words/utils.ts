type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface ExpectedObj {
  word: string;
  definition: string;
}

export function validateWord(wordObj: any): Result<ExpectedObj> {
  // word must be a string and cannot be empty
  if (typeof wordObj.word !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof wordObj.word}`
    };
  }
  // word must be a string and cannot be empty
  if (typeof wordObj.definition !== "string") {
    return {
      ok: false,
      message: `must be of type string, received ${typeof wordObj.definition}`
    };
  }

  return { ok: true, value: wordObj };
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
  const pattern = /[0-9]/g;
  const result = num.match(pattern)
  const n:string = result?.length > 0 && result?.length === num?.length ? result.join("") : "";
  return n.length > 0;
}