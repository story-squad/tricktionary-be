"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSettings = void 0;
function timerSeconds(seconds) {
    const test = String(seconds);
    const pattern = /[0-9]/g;
    const result = test.match(pattern) || [];
    if (result.length === test.length) {
        return result.join("");
    }
}
function GameSettings(settingsObj) {
    const { word } = settingsObj;
    let source = settingsObj.source;
    let seconds = settingsObj.seconds;
    let filter = settingsObj.filter;
    if (Object.keys(word).filter(n => n === "id").length === 0) {
        return { ok: false, message: `missing element word.id` };
    }
    if (!source && word.id > 0) {
        source = "Words";
    }
    if (word.id === 0) {
        source = "User";
        // requires custom definition
        if (typeof (word === null || word === void 0 ? void 0 : word.word) !== "string") {
            return { ok: false, message: `missing element word.word` };
        }
        if (typeof (word === null || word === void 0 ? void 0 : word.definition) !== "string") {
            return { ok: false, message: `missing element word.definition` };
        }
        if (word.word.length === 0) {
            return { ok: false, message: `length of word must be greater than zero` };
        }
        if (word.definition.length === 0) {
            return {
                ok: false,
                message: `length of definition must be greater than zero`
            };
        }
    }
    if (!filter) {
        filter = {
            style: "default",
            list: []
        };
    }
    if (!filter.style) {
        filter = Object.assign(Object.assign({}, filter), { style: "default" });
    }
    if (!filter.list) {
        filter = Object.assign(Object.assign({}, filter), { list: [] });
    }
    seconds = timerSeconds(seconds);
    const value = { word, seconds, filter, source };
    return { ok: true, value };
}
exports.GameSettings = GameSettings;
//# sourceMappingURL=GameSettings.js.map