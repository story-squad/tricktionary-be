[tricktionary-be](../README.md) / [Exports](../modules.md) / handleLobbyJoin

# Module: handleLobbyJoin

## Table of contents

### Functions

- [default](handlelobbyjoin.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `username`: *string*, `lobbyCode`: *any*, `lobbies`: *any*): *Promise*<*void*\>

Connects the player with the active game being played.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`io` | *any* | (socket io)   |
`socket` | *any* | (socket io)   |
`username` | *string* | Player's name   |
`lobbyCode` | *any* | Player's join code   |
`lobbies` | *any* | game-state    |

**Returns:** *Promise*<*void*\>

Defined in: [handleLobbyJoin.ts:19](https://github.com/story-squad/tricktionary-be/blob/dee3a3a/src/sockets/handleLobbyJoin.ts#L19)
