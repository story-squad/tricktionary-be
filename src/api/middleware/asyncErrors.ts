import { NextFunction, Request, Response, Router } from "express";
import { log } from "../../logger";
import { errorMessage } from "../../errorMessage";

type Handler = (req: Request, res: Response, next: NextFunction) => unknown;

/**
 * Send rejected promises from a router's route handlers to Express.
 *
 * Express 4 ignores the promise an async handler returns, so an error thrown
 * inside one becomes an unhandled rejection, which stops the Node process.
 * This wraps every handler already registered on the router so that a
 * rejection is passed to `next(err)`, where `handleErrors` turns it into a 500.
 * Call it after the routes are registered (the route modules register theirs
 * when they are imported).
 *
 * @param router an Express router
 * @returns the same router
 */
export function forwardAsyncErrors(router: Router): Router {
  router.stack.forEach((layer: any) => {
    layer.route?.stack.forEach((routeLayer: any) => {
      const handle: Handler = routeLayer.handle;
      // four arguments is an error handler; Express calls those differently
      if (handle.length > 3 || (handle as any).forwardsAsyncErrors) return;
      const wrapped = function (req: Request, res: Response, next: NextFunction) {
        const result: any = handle(req, res, next);
        if (result && typeof result.then === "function") {
          result.then(undefined, next);
        }
        return result;
      };
      wrapped.forwardsAsyncErrors = true;
      routeLayer.handle = wrapped;
    });
  });
  return router;
}

/**
 * Express error-handling middleware: an error from a handler becomes a 500
 * reply instead of an unhandled crash. If the handler already finished a
 * reply, the error is only logged; if it started one and then failed, Express
 * closes the connection.
 */
export function handleErrors(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  log(`[ERROR] ${req.method} ${req.originalUrl}: ${errorMessage(err)}`);
  if (res.writableEnded) return;
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "internal server error" });
}
