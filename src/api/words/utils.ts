type Result<T> = { ok: true; value: T } | { ok: false; message: string };

interface WordObject {
  word: string;
  definition: string | undefined;
  source?: string | undefined;
  moderated?: boolean;
  approved?: boolean;
}

export function validateWord(wordObj: WordObject): Result<WordObject> {
  const skel: WordObject = { word: '', definition: undefined, source: undefined, moderated: false, approved: false }
  const value: WordObject = { ...skel, ...wordObj }
  if (!value.word) {
    return {
      ok: false,
      message: "Word field is required"
    };
  }
  if (!value.definition) {
    return {
      ok: false,
      message: "Definition field is required"
    };
  }

  return { ok: true, value };
}

export function range(n: number): number[] {
  return Array.from(Array(n).keys());
}

/**
 * is this a number ?
 * @param num string
 *
 * this function exists because typeof(NaN) === "number"; wtfJS!?
 *
 */
export function validNumber(num: any): boolean {
  try {
    const pattern = /[0-9]/g;
    const result = num.match(pattern)
    const n: string = result?.length > 0 && result?.length === num?.length ? result.join("") : "";
    return n.length > 0;
  } catch (err: any) {
    return false
  }
}