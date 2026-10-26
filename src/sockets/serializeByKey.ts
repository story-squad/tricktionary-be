const pending = new Map<string, Promise<unknown>>();

/**
 * Runs `task` after any task already queued under the same key has settled,
 * so tasks for one key never overlap. Tasks under different keys run freely.
 *
 * @param key queue key (e.g. a socket id)
 * @param task the async work to run
 * @returns the task's result
 */
export function serializeByKey<T>(
  key: string,
  task: () => Promise<T>
): Promise<T> {
  const previous = pending.get(key) ?? Promise.resolve();
  const run = previous.catch(() => undefined).then(task);
  pending.set(key, run);
  const cleanup = () => {
    if (pending.get(key) === run) pending.delete(key);
  };
  run.then(cleanup, cleanup);
  return run;
}
