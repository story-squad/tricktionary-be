import cron from "node-cron";

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
    console.log(`started a 'pulse check' for ${lobbyCode} ${delta}s ago`);
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
      task: cron.schedule(pulseCheck, () => checkPulse(lobbies, lobbyCode, io))
    };
    lobbyTasks[lobbyCode] = scheduledTask; // add task to register
    startScheduledTask(lobbyCode); // start the task
  }
}

function checkPulse(o: any, k: string, io: any) {
  const needsChecking = () =>
    o[k].players.filter((p: any) => p.pulseCheck && p.connected);
  const task = lobbyTasks[k]; // the first cron task for this room(k).
  task.count += 1; // increase the count by 1
  task.last = Date.now(); // note: if client emits back a ("pulse check", timestamp), we can measure lag
  needsChecking().forEach((p: any) => {
    console.log(`checking the pulse of ${p.username} @ ${k}`);
    io.to(p.id).emit("pulse check", task.last);
  });
  if (task.count === task.limit) {
    // if we've reached the limit for this task, destroy it
    destroyScheduledTask(k);
  }
}

function stopScheduledTask(lobbyCode: string) {
  try {
    console.log("stopping task for room", lobbyCode);
    const task = lobbyTasks[lobbyCode];
    task.task.stop();
  } catch (err) {
    console.log(err.message);
  }
}

function destroyScheduledTask(lobbyCode: string) {
  try {
    const lt = lobbyTasks[lobbyCode];
    console.log(`destroying ${lt.name} for room, ${lobbyCode}`);
    lt.task.destroy();
    delete lobbyTasks[lobbyCode]; // remove the cronTask from our list.
  } catch (err) {
    console.log(err.message);
  }
}

function startScheduledTask(lobbyCode: string) {
  try {
    const lt = lobbyTasks[lobbyCode];
    console.log(`starting ${lt.name} for room, ${lobbyCode}`);
    lt.task.start();
  } catch (err) {
    console.log(err.message);
  }
}
/**
 * @returns
 * a Tricktionary scheduled-task
 */
function getScheduledTask(lobbyCode: string) {
  return lobbyTasks[lobbyCode];
}

export {
  schedulePulseCheck,
  startScheduledTask,
  stopScheduledTask,
  destroyScheduledTask,
  getScheduledTask,
  cronTask,
  cronTaskIndex,
  lobbyTasks
};
