"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleTimer = exports.schedulePulseCheck = exports.lobbyTasks = exports.getScheduledTask = exports.deleteScheduledTask = exports.stopScheduledTask = exports.startScheduledTask = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = require("../logger");
// const MINUTES = process.env.MINUTES || 5;
const HOURS = "*";
const DAY_OF_MONTH = "*";
const MONTH = "*";
const DAY_OF_WEEK = "*";
const lobbyTasks = {};
exports.lobbyTasks = lobbyTasks;
/**
 * increase the task.count by 1,
 * delete when we reach the task.limit
 *
 * note: a task limit of 0 will run forever
 *
 * @param k key-name of task within LobbyTasks
 */
function incrementTask(k) {
    const t = lobbyTasks[k];
    t.count += 1;
    t.last = Date.now();
    if (t.limit === t.count) {
        logger_1.log(`finished, ${t.name}`);
        // if we've reached the limit for this task, delete it
        deleteScheduledTask(t.name);
    }
}
/**
 * schedule a 'pulse check' for re-connected players in this game (lobbyCode)
 *
 * creates a Tricktionary scheduled-task
 *
 */
function schedulePulseCheck(io, lobbies, lobbyCode, limit) {
    // check to see if this task is already running.
    const pulseCheck = `*/2 * ${HOURS} ${DAY_OF_MONTH} ${MONTH} ${DAY_OF_WEEK}`;
    let scheduledTask;
    if (lobbyTasks[lobbyCode]) {
        // we have a task running already, get it.
        scheduledTask = lobbyTasks[lobbyCode];
        const delta = Math.abs(Date.now() - scheduledTask.created) / 1000;
        logger_1.log(`started a 'pulse check' for ${lobbyCode} ${delta}s ago`);
    }
    else {
        // create a task
        let now = Date.now();
        scheduledTask = {
            name: "pulse check",
            created: now,
            last: now,
            limit,
            count: 0,
            lobbyCode,
            task: node_cron_1.default.schedule(pulseCheck, () => checkPulse(lobbies, lobbyCode, io)),
        };
        lobbyTasks[lobbyCode] = scheduledTask; // add task to register
        startScheduledTask(lobbyCode); // start the task
    }
}
exports.schedulePulseCheck = schedulePulseCheck;
function checkPulse(o, k, io) {
    const needsChecking = () => o[k].players.filter((p) => p.pulseCheck && p.connected);
    const task = lobbyTasks[k]; // the first cron task for this room(k).
    incrementTask(k);
    needsChecking().forEach((p) => {
        logger_1.log(`checking the pulse of ${p.username} @ ${k}`);
        io.to(p.id).emit("pulse check", task.last);
    });
}
function stopScheduledTask(lobbyCode) {
    try {
        logger_1.log(`stopping task, ${lobbyCode}`);
        const task = lobbyTasks[lobbyCode];
        task.task.stop();
    }
    catch (err) {
        logger_1.log(err.message);
    }
}
exports.stopScheduledTask = stopScheduledTask;
function deleteScheduledTask(taskName) {
    try {
        const task = lobbyTasks[taskName];
        logger_1.log(`deleting task: ${task.name}`);
        task.task.stop();
        delete lobbyTasks[taskName]; // remove the cronTask from our list.
    }
    catch (err) {
        logger_1.log(err.message);
    }
}
exports.deleteScheduledTask = deleteScheduledTask;
function startScheduledTask(lobbyCode) {
    try {
        const lt = lobbyTasks[lobbyCode];
        logger_1.log(`starting ${lt.name} for room, ${lobbyCode}`);
        lt.task.start();
    }
    catch (err) {
        logger_1.log(err.message);
    }
}
exports.startScheduledTask = startScheduledTask;
/**
 * @returns
 * a Tricktionary scheduled-task
 */
function getScheduledTask(lobbyCode) {
    return lobbyTasks[lobbyCode];
}
exports.getScheduledTask = getScheduledTask;
function echoTime(io, timerTask, lobbyCode) {
    incrementTask(timerTask);
    const t = lobbyTasks[timerTask];
    io.to(lobbyCode).emit("synchronize", t.limit - t.count);
}
function scheduleTimer(io, lobbyCode, limit) {
    // check to see if the timer is already running.
    const utcTime = `* * ${HOURS} ${DAY_OF_MONTH} ${MONTH} ${DAY_OF_WEEK}`;
    let scheduledTask;
    const timerTask = `${lobbyCode}-timer`;
    if (lobbyTasks[timerTask]) {
        // we have a timer running already, get it.
        scheduledTask = lobbyTasks[timerTask];
        const delta = Math.abs(Date.now() - scheduledTask.created) / 1000;
        logger_1.log(`timer was initialized ${timerTask} ${delta}s ago`);
        return;
    }
    else {
        // create a task
        let now = Date.now();
        scheduledTask = {
            name: timerTask,
            created: now,
            last: now,
            limit,
            count: 0,
            lobbyCode,
            task: node_cron_1.default.schedule(utcTime, () => echoTime(io, timerTask, lobbyCode)),
        };
        lobbyTasks[timerTask] = scheduledTask; // add task to register
        startScheduledTask(timerTask); // start the task
    }
}
exports.scheduleTimer = scheduleTimer;
//# sourceMappingURL=crontab.js.map