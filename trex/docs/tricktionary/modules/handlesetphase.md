[tricktionary-be](../README.md) / [Exports](../modules.md) / handleSetPhase

# Module: handleSetPhase

## Table of contents

### Functions

- [default](handlesetphase.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `lobbyCode`: *any*, `lobbies`: *any*, `phase`: *string*): *Promise*<void\>

Allows the host to change game state. *experimental feature

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socketio)   |
`socket` | *any* | (socketio)   |
`lobbyCode` | *any* | key-string   |
`lobbies` | *any* | memo-object   |
`phase` | *string* | gamestate-string    |

**Returns:** *Promise*<void\>

Defined in: [handleSetPhase.ts:14](https://github.com/story-squad/tricktionary-be/blob/d474aad/src/sockets/handleSetPhase.ts#L14)
