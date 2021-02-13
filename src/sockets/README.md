## io
[table of contents](/docs/README.md)

#
## websocket events

**socket . id  = current player . id*


| Event   | Handler(s) | Client Params | Description |
|---------|---------|--------|-------------|
| "login" | [handleReturningPlayer](/docs/modules/handleReturningPlayer.md), [handleNewPlayer](../../docs/modules/handleNewPlayer.md) | token or undefined | emits "token update" , NEWTOKEN
| "create lobby" | [handleLobbyCreate](/docs/modules/handleLobbyCreate.md) | username | creates a new lobby |
| "join lobby" | [handleLobbyJoin](/docs/modules/handleLobbyJoin.md) | lobbyCode | joins an existing lobby |
| "start game" | [handleStartGame](/docs/modules/handleStartGame.md) | lobbyCode | start playing Tricktionary |
| "definition submitted" | [handleSubmitDefinition](/docs/modules/handleSubmitDefinition.md) | definition, lobbyCode| submit a definition for the current word |
| "guess" | [handleArrayOfGuesses](/docs/modules/handleArrayOfGuesses.md) | lobbyCode, guesses[] | vote/select/guess definition of current word; |
| "play again" | [handlePlayAgain](/docs/modules/handlePlayAgain.md) | lobbyCode | continue playing Tricktionary, persist scores and start a new round. |


