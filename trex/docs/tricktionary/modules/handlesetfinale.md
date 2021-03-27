[tricktionary-be](../README.md) / [Exports](../modules.md) / handleSetFinale

# Module: handleSetFinale

## Table of contents

### Functions

- [default](handlesetfinale.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `lobbyCode`: *any*, `lobbies`: *any*): *Promise*<void\>

Allows the host to store and retrieve

1) three top scoring users
2) these users' top-three definitions for the whole game (from any round)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socketio)   |
`socket` | *any* | (socketio)   |
`lobbyCode` | *any* | key-string   |
`lobbies` | *any* | memo-object    |

**Returns:** *Promise*<void\>

Defined in: [handleSetFinale.ts:23](https://github.com/story-squad/tricktionary-be/blob/d006efb/src/sockets/handleSetFinale.ts#L23)
