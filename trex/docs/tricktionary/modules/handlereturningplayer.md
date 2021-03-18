[tricktionary-be](../README.md) / [Exports](../modules.md) / handleReturningPlayer

# Module: handleReturningPlayer

## Table of contents

### Functions

- [default](handlereturningplayer.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `token`: *string* \| *undefined*, `lobbies`: *any*): *Promise*<undefined \| { `message`: *any* ; `ok`: *boolean* = false }\>

Determine whether or not the player should auto re-join an existing game.

In the case of a rejoin; It calls **handleLobbyJoin**
_after marking the old player with the incoming socket.id_

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socket io)   |
`socket` | *any* | (socket io)   |
`token` | *string* \| *undefined* | JWT   |
`lobbies` | *any* | game-state    |

**Returns:** *Promise*<undefined \| { `message`: *any* ; `ok`: *boolean* = false }\>

Defined in: [handleReturningPlayer.ts:16](https://github.com/story-squad/tricktionary-be/blob/4020081/src/sockets/handleReturningPlayer.ts#L16)
