/**
 * The message of a value caught by `catch`.
 *
 * TypeScript types a `catch` binding as `unknown`, because anything can be
 * thrown. Errors (and error-like objects with a string `message`) give their
 * message; any other thrown value gives its string form.
 *
 * @param err the caught value
 * @returns a message describing it
 */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof err.message === "string"
  ) {
    return err.message;
  }
  return String(err);
}
