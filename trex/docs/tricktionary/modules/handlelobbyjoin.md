[tricktionary-be](../README.md) / [Exports](../modules.md) / handleLobbyJoin

# Module: handleLobbyJoin

## Table of contents

### Functions

- [default](handlelobbyjoin.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `username`: *string*, `lobbyCode`: *any*, `lobbies`: *any*, `doCheckPulse`: *boolean* \| *undefined*): *Promise*<void\>

Connects the player with the active game being played.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socket io)   |
`socket` | *any* | (socket io)   |
`username` | *string* | Player's name   |
`lobbyCode` | *any* | Player's join code   |
`lobbies` | *any* | game-state    |
`doCheckPulse` | *boolean* \| *undefined* | - |

**Returns:** *Promise*<void\>

Defined in: [handleLobbyJoin.ts:23](https://github.com/story-squad/tricktionary-be/blob/c746891/src/sockets/handleLobbyJoin.ts#L23)
