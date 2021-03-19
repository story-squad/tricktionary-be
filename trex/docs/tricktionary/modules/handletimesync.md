[tricktionary-be](../README.md) / [Exports](../modules.md) / handleTimeSync

# Module: handleTimeSync

## Table of contents

### Functions

- [default](handletimesync.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `lobbies`: *any*, `seconds`: *number*): *Promise*<void\>

emit ("synchronize", seconds) to all *connected* players; excluding the current host

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socketio)   |
`socket` | *any* | (socketio)   |
`lobbies` | *any* | memo-object   |
`seconds` | *number* | - |

**Returns:** *Promise*<void\>

Defined in: [handleTimeSync.ts:17](https://github.com/story-squad/tricktionary-be/blob/be79db4/src/sockets/handleTimeSync.ts#L17)
