[tricktionary-be](../README.md) / [Exports](../modules.md) / handleErrorMessage

# Module: handleErrorMessage

## Table of contents

### Functions

- [default](handleerrormessage.md#default)

## Functions

### default

▸ **default**(`io`: *any*, `socket`: *any*, `code`: *number*, `error`: *string* \| *undefined*): *Promise*<void\>

emit "error" message to player at socket.id

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | any (socketio)   |
`socket` | *any* | any (socketio)   |
`code` | *number* | - |
`error` | *string* \| *undefined* | string    |

**Returns:** *Promise*<void\>

Defined in: [handleErrorMessage.ts:9](https://github.com/story-squad/tricktionary-be/blob/f060393/src/sockets/handleErrorMessage.ts#L9)
