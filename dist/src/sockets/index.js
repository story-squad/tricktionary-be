"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handleLobbyLeave_1 = __importDefault(require("./handleLobbyLeave"));
const handleLobbyCreate_1 = __importDefault(require("./handleLobbyCreate"));
const handleLobbyJoin_1 = __importDefault(require("./handleLobbyJoin"));
const handleStartGame_1 = __importDefault(require("./handleStartGame"));
const handleSubmitDefinition_1 = __importDefault(require("./handleSubmitDefinition"));
const handlePlayAgain_1 = __importDefault(require("./handlePlayAgain"));
const handleGuess_1 = __importStar(require("./handleGuess"));
const handleFortune_1 = __importDefault(require("./handleFortune"));
const handleErrorMessage_1 = __importDefault(require("./handleErrorMessage"));
const handleSetPhase_1 = __importDefault(require("./handleSetPhase"));
const handleSetNewHost_1 = __importDefault(require("./handleSetNewHost"));
const handleNewPlayer_1 = __importDefault(require("./handleNewPlayer"));
const handleReturningPlayer_1 = __importDefault(require("./handleReturningPlayer"));
const handleDisconnection_1 = __importDefault(require("./handleDisconnection"));
const handleUpdateUsername_1 = __importDefault(require("./handleUpdateUsername"));
const handleTimeSync_1 = __importDefault(require("./handleTimeSync"));
const handleMessageHost_1 = __importDefault(require("./handleMessageHost"));
const handleMessagePlayer_1 = __importDefault(require("./handleMessagePlayer"));
const handleLobbyJoinWithPassword_1 = __importDefault(require("./handleLobbyJoinWithPassword"));
exports.default = {
    handleLobbyLeave: handleLobbyLeave_1.default,
    handleLobbyCreate: handleLobbyCreate_1.default,
    handleLobbyJoin: handleLobbyJoin_1.default,
    handleStartGame: handleStartGame_1.default,
    handleSubmitDefinition: handleSubmitDefinition_1.default,
    handlePlayAgain: handlePlayAgain_1.default,
    handleGuess: handleGuess_1.default,
    handleArrayOfGuesses: handleGuess_1.handleArrayOfGuesses,
    handleFortune: handleFortune_1.default,
    handleErrorMessage: handleErrorMessage_1.default,
    handleSetPhase: handleSetPhase_1.default,
    handleSetNewHost: handleSetNewHost_1.default,
    handleNewPlayer: handleNewPlayer_1.default,
    handleReturningPlayer: handleReturningPlayer_1.default,
    handleDisconnection: handleDisconnection_1.default,
    handleUpdateUsername: handleUpdateUsername_1.default,
    handleTimeSync: handleTimeSync_1.default,
    handleMessageHost: handleMessageHost_1.default,
    handleMessagePlayer: handleMessagePlayer_1.default,
    handleLobbyJoinWithPassword: handleLobbyJoinWithPassword_1.default
};
//# sourceMappingURL=index.js.map