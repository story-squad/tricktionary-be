import randomizer from "randomatic";

import {log} from "../logger";
import unsavory from "./unsavory.json";

function matchWords(subject: string, words: any[]) {
  const regexMetachars = /[(){[*+?.\\^$|]/g;
  const escapeMetaStrings = words.map((w: string) =>
    w.replace(regexMetachars, "\\$&")
  );
  const regex = new RegExp(
    "\\b(?:" + escapeMetaStrings.join("|") + ")\\b",
    "gi"
  );
  return subject.match(regex) || [];
}

function pseudoRandomizer(
  p: string,
  l?: number | undefined,
  options?:
    | {
        chars?: string | undefined;
        exclude?: string | string[] | undefined;
      }
    | undefined,
  testing?: boolean
):string {
  const raw = testing ? "BECH" : randomizer(p, l, options);
  const filtered = matchWords(raw, unsavory);
  const unsavoryCode = filtered.length > 0;
  if (unsavoryCode) {
    log(`[UNSAVORY!]: ${filtered.join(",")}`);
    return pseudoRandomizer(p, l, options);
  }
  return raw;
}

export default pseudoRandomizer;
