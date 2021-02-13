## io
[table of contents](../../docs/README.md)
****socket . id  = current player . id***

| Event   | Handler | Params | Description |
|---------|---------|--------|-------------|
| create lobby | handleLobbyCreate | username, lobbies | create a new lobby |
| join lobby | handleLobbyJoin | lobbyCode, lobbies | join lobby (lobbyCode REQUIRED) |
| start game | handleStartGame | lobbyCode, lobbies | start playing Tricktionary |
|definition submitted | handleSubmitDefinition | definition, lobbyCode, lobbies | submit a definition for the current word |
| guess | handleGuess | lobbyCode, guess, lobbies | vote/select/guess definition of current word |
| play again | handlePlayAgain | lobbyCode, lobbies | continue playing Tricktionary, persist scores and start a new round |
| disconnecting | handleLobbyLeave | lobbies | remove player from lobby |

