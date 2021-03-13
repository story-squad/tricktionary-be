export { boxMyText, range, repeat, makeSpaces };

/**
 * @param n Number
 * @returns array of numbers from 0 to n
 */
function range(n: number) {
  return Array.from({ length: n }, (x, i) => i);
}

/**
 * string multiplication
 * @param s string to be repeated
 * @param n how many times
 * @returns a string repeated n times
 */
function repeat(s: string, n: number) {
  return range(n)
    .map(() => s)
    .join("");
}

/**
 * space ' ' multiplication
 * @param n number of blank spaces
 * @returns a string of n spaces
 */
function makeSpaces(n: number) {
  return range(n)
    .map(() => " ")
    .join("");
}

/**
 * Box my text
 * @param textArray ["title", "description", "etc."]
 * @param boxWidth how wide should we make this box ? defaults to 65
 * @returns your text, centered, in a box made of strings
 */
function boxMyText(textArray: string[], boxWidth: number | undefined) {
  function boxTextLine(text: string, width: number) {
    const rspace = width - text.length; // remaining space
    const lpad = Math.ceil(rspace / 2) - 2;
    const rpad = width - text.length - lpad - 2;
    return `│${makeSpaces(lpad)}${text}${makeSpaces(rpad)}│`;
  }
  const width = boxWidth ? boxWidth : 65; // length of text box
  const mid = textArray.map((t) => boxTextLine(t, width));
  const top = `╭${repeat("─", width - 2)}╮`;
  const bot = `╰${repeat("─", width - 2)}╯`;
  const result:string = [[top], ...mid, [bot]].join("\n");
  return result;
}
