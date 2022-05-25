import cron from "node-cron";
import { log } from "../logger";

// const MINUTES = process.env.MINUTES || 5;
const HOURS = "*";
const DAY_OF_MONTH = "*";
const MONTH = "*";
const DAY_OF_WEEK = "*";

/**
 * a Tricktionary scheduled-task
 *
 * @name - semantic name of this task; ie "pulse check"
 * @lobbyCode - location code of game requiring this task
 * @limit - maximum number of times to run this task
 * @count - number of times this task has been run
 * @created - timestamp when this task was created
 * @last - timestamp when this task was last run
 * @task - cron.ScheduledTask
 *
 */
interface cronTask {
  name: string; // name of task
  lobbyCode: string; // lobbyCode
  limit: number; // maximum number of times to run this task
  count: number; // number of times this task has been run
  created: number; // timestamp
  last: number; // timestamp
  task: cron.ScheduledTask;
}

/**
 * Tricktionary cronTask memo; indexed by lobbyCode
 */
interface cronTaskIndex {
  [key: string]: cronTask;
}

const lobbyTasks: cronTaskIndex = {};

/**
 * increase the task.count by 1,
 * delete when we reach the task.limit
 *
 * note: a task limit of 0 will run forever
 *
 * @param k key-name of task within LobbyTasks
 */
function incrementTask(k: string) {
  const t = lobbyTasks[k];
  t.count += 1;
  t.last = Date.now();
  log(`${t.name}, ${t.count}`);
  if (t.count >= t.limit) {
    log(`[delete] task: ${t.name}`);
    t.task.stop();
    delete lobbyTasks[k]; // remove the cronTask from our list.
    return { continue: false };
  }
  return { continue: true };
}

/**
 * schedule a 'pulse check' for re-connected players in this game (lobbyCode)
 *
 * creates a Tricktionary scheduled-task
 *
 */
function schedulePulseCheck(
  io: any,
  lobbies: any,
  lobbyCode: string,
  limit: number
) {
  // check to see if this task is already running.
  const pulseCheck = `*/2 * ${HOURS} ${DAY_OF_MONTH} ${MONTH} ${DAY_OF_WEEK}`;
  let scheduledTask: cronTask;

  if (lobbyTasks[lobbyCode]) {
    // we have a task running already, get it.
    scheduledTask = lobbyTasks[lobbyCode];
    const delta = Math.abs(Date.now() - scheduledTask.created) / 1000;
    log(`started a 'pulse check' for ${lobbyCode} ${delta}s ago`);
  } else {
    // create a task
    let now = Date.now();
    scheduledTask = {
      name: "pulse check",
      created: now,
      last: now,
      limit,
      count: 0,
      lobbyCode,
      task: cron.schedule(pulseCheck, () => checkPulse(lobbies, lobbyCode, io)),
    };
    lobbyTasks[lobbyCode] = scheduledTask; // add task to register
    startScheduledTask(lobbyCode); // start the task
  }
}

function checkPulse(o: any, k: string, io: any) {
  const needsChecking = () =>
    o[k].players.filter((p: any) => p.pulseCheck && p.connected);
  const task = lobbyTasks[k]; // the first cron task for this room(k).
  const status = incrementTask(k);
  needsChecking().forEach((p: any) => {
    log(`checking the pulse of ${p.username} @ ${k}`);
    io.to(p.id).emit("pulse check", task.last);
  });
  if (!status.continue) {
    // remove players who aren't connected
    o[k] = {
      ...o[k],
      players: o[k].players.filter((p: any) => p.connected),
    };
    io.to(k).emit("game update", o[k]);
  }
}

function stopScheduledTask(lobbyCode: string) {
  try {
    log(`stopping task, ${lobbyCode}`);
    const task = lobbyTasks[lobbyCode];
    task.task.stop();
  } catch (err:any){
    if (err instanceof Error) log(err.message);
  }
}

function startScheduledTask(lobbyCode: string) {
  try {
    const lt = lobbyTasks[lobbyCode];
    log(`starting ${lt.name} for room, ${lobbyCode}`);
    lt.task.start();
  } catch (err:any){
    if (err instanceof Error) log(err.message);
  }
}
/**
 * @returns
 * a Tricktionary scheduled-task
 */
function getScheduledTask(lobbyCode: string) {
  return lobbyTasks[lobbyCode];
}

function echoTime(io: any, timerTask: string, lobbyCode: string) {
  incrementTask(timerTask);
  const t = lobbyTasks[timerTask];
  io.to(lobbyCode).emit("synchronize", t.limit - t.count);
}

function scheduleTimer(io: any, lobbyCode: string, limit: number) {
  // check to see if the timer is already running.
  const utcTime = `* * ${HOURS} ${DAY_OF_MONTH} ${MONTH} ${DAY_OF_WEEK}`;
  let scheduledTask: cronTask;
  const timerTask = `${lobbyCode}-timer`;
  if (lobbyTasks[timerTask]) {
    // we have a timer running already, get it.
    scheduledTask = lobbyTasks[timerTask];
    const delta = Math.abs(Date.now() - scheduledTask.created) / 1000;
    log(`timer was initialized ${timerTask} ${delta}s ago`);
    return;
  } else {
    // create a task
    let now = Date.now();
    scheduledTask = {
      name: timerTask,
      created: now,
      last: now,
      limit,
      count: 0,
      lobbyCode,
      task: cron.schedule(utcTime, () => echoTime(io, timerTask, lobbyCode)),
    };
    lobbyTasks[timerTask] = scheduledTask; // add task to register
    startScheduledTask(timerTask); // start the task
  }
}

export {
  startScheduledTask,
  stopScheduledTask,
  getScheduledTask,
  cronTask,
  cronTaskIndex,
  lobbyTasks,
  schedulePulseCheck,
  scheduleTimer,
};
