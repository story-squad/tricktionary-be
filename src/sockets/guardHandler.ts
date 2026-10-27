import { log } from "../logger";
import { errorMessage } from "../errorMessage";

/**
 * Wrap a socket event listener so that an error in it is logged instead of
 * stopping the server.
 *
 * socket.io calls event listeners from `process.nextTick` and ignores the
 * promise an async listener returns, so a throw in a listener is an uncaught
 * exception and a rejection is an unhandled rejection; either one stops Node.
 * The wrapped listener catches both and logs them with the event name and
 * socket id. For a rejection to be caught, the listener must return the
 * handler's promise.
 *
 * @param event the event name, for the log
 * @param socket the socket the event came from
 * @param listener the listener; may return a promise
 * @returns a listener that never throws or rejects
 */
export function guardHandler<A extends any[]>(
  event: string,
  socket: { id: string },
  listener: (...args: A) => unknown
): (...args: A) => void {
  const report = (err: unknown) =>
    log(
      `[ERROR] socket event "${event}" from ${socket.id}: ${errorMessage(err)}`
    );
  return (...args: A) => {
    try {
      const result: any = listener(...args);
      if (result && typeof result.then === "function") {
        result.then(undefined, report);
      }
    } catch (err) {
      report(err);
    }
  };
}
