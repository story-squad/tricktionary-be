[tricktionary-be](../README.md) / [Exports](../modules.md) / handleMessagePlayer

# Module: handleMessagePlayer

## Table of contents

### Functions

- [default](handlemessageplayer.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `lobbies`: *any*, `playerId`: *string*, `category`: *string*, `message`: *any*): *Promise*<void\>

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socket io)   |
`socket` | *any* | (socket io)   |
`lobbies` | *any* | game-state   |
`playerId` | *string* | socket.id of recipient   |
`category` | *string* | recipient listener event   |
`message` | *any* | information being sent to the recipient    |

**Returns:** *Promise*<void\>

Defined in: [handleMessagePlayer.ts:12](https://github.com/story-squad/tricktionary-be/blob/0a7e440/src/sockets/handleMessagePlayer.ts#L12)
