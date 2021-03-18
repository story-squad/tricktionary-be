[tricktionary-be](../README.md) / [Exports](../modules.md) / handleRevealResults

# Module: handleRevealResults

## Table of contents

### Functions

- [default](handlerevealresults.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `lobbyCode`: *string*, `lobbies`: *any*, `guesses`: *any*[]): *Promise*<void\>

Reveal results to players

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socket io)   |
`socket` | *any* | (socket io)   |
`lobbyCode` | *string* | key-string   |
`lobbies` | *any* | memo-object   |
`guesses` | *any*[] | array    |

**Returns:** *Promise*<void\>

Defined in: [handleRevealResults.ts:13](https://github.com/story-squad/tricktionary-be/blob/ca7657b/src/sockets/handleRevealResults.ts#L13)
