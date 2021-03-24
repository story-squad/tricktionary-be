import handleLobbyLeave from "./handleLobbyLeave";
import handleLobbyCreate from "./handleLobbyCreate";
import handleLobbyJoin from "./handleLobbyJoin";
import handleStartGame from "./handleStartGame";
import handleSubmitDefinition from "./handleSubmitDefinition";
import handlePlayAgain from "./handlePlayAgain";
import { handleArrayOfGuesses } from "./handleGuess";
import handleErrorMessage from "./handleErrorMessage";
import handleSetPhase from "./handleSetPhase";
import handleSetNewHost from "./handleSetNewHost";
import handleNewPlayer from "./handleNewPlayer";
import handleReturningPlayer from "./handleReturningPlayer";
import handleDisconnection, { removeFromLobby } from "./handleDisconnection";
import handleUpdateUsername from "./handleUpdateUsername";
import handleTimeSync from "./handleTimeSync";
import handleMessageHost from "./handleMessageHost";
import handleMessagePlayer from "./handleMessagePlayer";
import handleRevealResults from "./handleRevealResults";
import handleSetFinale from "./handleSetFinale";
import handleEmojiSmash from "./handleEmojiSmash";
import handleGetReactions from "./handleGetReactions";

export default {
  handleLobbyLeave,
  handleLobbyCreate,
  handleLobbyJoin,
  handleStartGame,
  handleSubmitDefinition,
  handlePlayAgain,
  handleArrayOfGuesses,
  handleErrorMessage,
  handleSetPhase,
  handleSetNewHost,
  handleNewPlayer,
  handleReturningPlayer,
  handleDisconnection,
  handleUpdateUsername,
  handleTimeSync,
  handleMessageHost,
  handleMessagePlayer,
  handleRevealResults,
  handleSetFinale,
  handleEmojiSmash,
  handleGetReactions,
  removeFromLobby
};
