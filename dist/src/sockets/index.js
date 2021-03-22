"use strict";
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
const handleGuess_1 = require("./handleGuess");
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
const handleRevealResults_1 = __importDefault(require("./handleRevealResults"));
const handleSetFinale_1 = __importDefault(require("./handleSetFinale"));
const handleEmojiSmash_1 = __importDefault(require("./handleEmojiSmash"));
const handleGetReactions_1 = __importDefault(require("./handleGetReactions"));
const handleRemotePaint_1 = __importDefault(require("./handleRemotePaint"));
exports.default = {
    handleLobbyLeave: handleLobbyLeave_1.default,
    handleLobbyCreate: handleLobbyCreate_1.default,
    handleLobbyJoin: handleLobbyJoin_1.default,
    handleStartGame: handleStartGame_1.default,
    handleSubmitDefinition: handleSubmitDefinition_1.default,
    handlePlayAgain: handlePlayAgain_1.default,
    handleArrayOfGuesses: handleGuess_1.handleArrayOfGuesses,
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
    handleRevealResults: handleRevealResults_1.default,
    handleSetFinale: handleSetFinale_1.default,
    handleEmojiSmash: handleEmojiSmash_1.default,
    handleGetReactions: handleGetReactions_1.default,
    handleRemotePaint: handleRemotePaint_1.default,
};
//# sourceMappingURL=index.js.map