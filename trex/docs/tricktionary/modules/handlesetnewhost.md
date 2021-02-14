[tricktionary-be](../README.md) / [Exports](../modules.md) / handleSetNewHost

# Module: handleSetNewHost

## Table of contents

### Functions

- [default](handlesetnewhost.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `lobbyCode`: *any*, `lobbies`: *any*, `newHost`: *string*): *Promise*<*void*\>

Allow the current host to trade roles with a player. *experimental feature

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`io` | *any* | (socketio)   |
`socket` | *any* | (socketio)   |
`lobbyCode` | *any* | key-string   |
`lobbies` | *any* | memo-object   |
`newHost` | *string* | playerID-string    |

**Returns:** *Promise*<*void*\>

Defined in: [handleSetNewHost.ts:14](https://github.com/story-squad/tricktionary-be/blob/9ef6231/src/sockets/handleSetNewHost.ts#L14)
