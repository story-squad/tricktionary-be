"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScheduledTask = exports.destroyScheduledTask = exports.stopScheduledTask = exports.startScheduledTask = exports.schedulePulseCheck = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
// const MINUTES = process.env.MINUTES || 5;
const HOURS = "*";
const DAY_OF_MONTH = "*";
const MONTH = "*";
const DAY_OF_WEEK = "*";
const lobbyTasks = {};
/**
 * schedule a 'pulse check' for re-connected players in this game (lobbyCode)
 */
function schedulePulseCheck(io, lobbies, lobbyCode, limit) {
    // check to see if this task is already running.
    const pulseCheck = `*/2 * ${HOURS} ${DAY_OF_MONTH} ${MONTH} ${DAY_OF_WEEK}`;
    let scheduledTask;
    if (lobbyTasks[lobbyCode]) {
        // we have a task running already, get it.
        scheduledTask = lobbyTasks[lobbyCode];
        const delta = Math.abs(Date.now() - scheduledTask.created) / 1000;
        console.log(`started a 'pulse check' for ${lobbyCode} ${delta}s ago`);
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
            task: node_cron_1.default.schedule(pulseCheck, () => checkPulse(lobbies, lobbyCode, io))
        };
        lobbyTasks[lobbyCode] = scheduledTask; // add task to register
        startScheduledTask(lobbyCode); // start the task
    }
}
exports.schedulePulseCheck = schedulePulseCheck;
function checkPulse(o, k, io) {
    const needsChecking = () => o[k].players.filter((p) => p.pulseCheck && p.connected);
    const task = lobbyTasks[k]; // the first cron task for this room(k).
    task.count += 1; // increase the count by 1
    task.last = Date.now(); // note: if client emits back a ("pulse check", timestamp), we can measure lag
    needsChecking().forEach((p) => {
        console.log(`checking the pulse of ${p.username} @ ${k}`);
        io.to(p.id).emit("pulse check", task.last);
    });
    if (task.count === task.limit) {
        // if we've reached the limit for this task, destroy it
        destroyScheduledTask(k);
    }
}
function stopScheduledTask(lobbyCode) {
    try {
        console.log("stopping task for room", lobbyCode);
        const task = lobbyTasks[lobbyCode];
        task.task.stop();
    }
    catch (err) {
        console.log(err.message);
    }
}
exports.stopScheduledTask = stopScheduledTask;
function destroyScheduledTask(lobbyCode) {
    try {
        const lt = lobbyTasks[lobbyCode];
        console.log(`destroying ${lt.name} for room, ${lobbyCode}`);
        lt.task.destroy();
        delete lobbyTasks[lobbyCode]; // remove the cronTask from our list.
    }
    catch (err) {
        console.log(err.message);
    }
}
exports.destroyScheduledTask = destroyScheduledTask;
function startScheduledTask(lobbyCode) {
    try {
        const lt = lobbyTasks[lobbyCode];
        console.log(`starting ${lt.name} for room, ${lobbyCode}`);
        lt.task.start();
    }
    catch (err) {
        console.log(err.message);
    }
}
exports.startScheduledTask = startScheduledTask;
function getScheduledTask(lobbyCode) {
    return lobbyTasks[lobbyCode];
}
exports.getScheduledTask = getScheduledTask;
//# sourceMappingURL=crontab.js.map