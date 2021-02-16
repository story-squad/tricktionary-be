[tricktionary-be](../README.md) / [Exports](../modules.md) / common

# Module: common

## Table of contents

### Variables

- [LC\_LENGTH](common.md#lc_length)
- [b64](common.md#b64)
- [localAxios](common.md#localaxios)

### Functions

- [checkSettings](common.md#checksettings)
- [contributeWord](common.md#contributeword)
- [fortune](common.md#fortune)
- [gameExists](common.md#gameexists)
- [newPlayerRecord](common.md#newplayerrecord)
- [playerIdWasHost](common.md#playeridwashost)
- [playerIsHost](common.md#playerishost)
- [privateMessage](common.md#privatemessage)
- [sendToHost](common.md#sendtohost)
- [startNewRound](common.md#startnewround)
- [updatePlayerToken](common.md#updateplayertoken)
- [whereAmI](common.md#whereami)
- [wordFromID](common.md#wordfromid)

## Variables

### LC\_LENGTH

• `Const` **LC\_LENGTH**: *number*= 4

Defined in: [common.ts:15](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L15)

___

### b64

• `Const` **b64**: *object*

#### Type declaration:

Name | Type |
------ | ------ |
`decode` | (`str`: *string*) => *string* |
`encode` | (`str`: *string*) => *string* |

Defined in: [common.ts:230](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L230)

___

### localAxios

• `Const` **localAxios**: AxiosInstance

Defined in: [common.ts:9](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L9)

## Functions

### checkSettings

▸ **checkSettings**(`settings`: *any*): { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

#### Parameters:

Name | Type |
------ | ------ |
`settings` | *any* |

**Returns:** { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

Defined in: [common.ts:105](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L105)

___

### contributeWord

▸ **contributeWord**(`word`: *string*, `definition`: *string*, `source`: *string*): *Promise*<{ `definition`: *string* ; `id`: *number* = 0; `source`: *string* ; `word`: *string*  }\>

#### Parameters:

Name | Type |
------ | ------ |
`word` | *string* |
`definition` | *string* |
`source` | *string* |

**Returns:** *Promise*<{ `definition`: *string* ; `id`: *number* = 0; `source`: *string* ; `word`: *string*  }\>

Defined in: [common.ts:119](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L119)

___

### fortune

▸ **fortune**(): *Promise*<{ `fortune`: *string* = "coming soon?" }\>

**Returns:** *Promise*<{ `fortune`: *string* = "coming soon?" }\>

Defined in: [common.ts:35](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L35)

___

### gameExists

▸ **gameExists**(`lobbyCode`: *string*, `lobbies`: *any*): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`lobbyCode` | *string* |
`lobbies` | *any* |

**Returns:** *boolean*

Defined in: [common.ts:232](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L232)

___

### newPlayerRecord

▸ **newPlayerRecord**(`socket`: *any*): *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `player`: *undefined* ; `token`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `player`: *any* ; `token`: *any*  }\>

#### Parameters:

Name | Type |
------ | ------ |
`socket` | *any* |

**Returns:** *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `player`: *undefined* ; `token`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `player`: *any* ; `token`: *any*  }\>

Defined in: [common.ts:236](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L236)

___

### playerIdWasHost

▸ **playerIdWasHost**(`playerId`: *string*, `lobbyCode`: *any*, `lobbies`: *any*): { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

#### Parameters:

Name | Type |
------ | ------ |
`playerId` | *string* |
`lobbyCode` | *any* |
`lobbies` | *any* |

**Returns:** { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

Defined in: [common.ts:96](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L96)

___

### playerIsHost

▸ **playerIsHost**(`socket`: *any*, `lobbyCode`: *any*, `lobbies`: *any*): { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

#### Parameters:

Name | Type |
------ | ------ |
`socket` | *any* |
`lobbyCode` | *any* |
`lobbies` | *any* |

**Returns:** { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

Defined in: [common.ts:87](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L87)

___

### privateMessage

▸ **privateMessage**(`io`: *any*, `socket`: *any*, `listener`: *string*, `message`: *string*): *Promise*<*void*\>

send message to socket.id

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`io` | *any* | any (socketio)   |
`socket` | *any* | any (socketio)   |
`listener` | *string* | string   |
`message` | *string* | string  helper function; not directly exposed to the public.  please handle all necessary authority role checks, prior to invocation.    |

**Returns:** *Promise*<*void*\>

Defined in: [common.ts:54](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L54)

___

### sendToHost

▸ **sendToHost**(`io`: *any*, `socket`: *any*, `lobbies`: *any*, `category`: *string*, `message`: *any*): *Promise*<*boolean*\>

#### Parameters:

Name | Type |
------ | ------ |
`io` | *any* |
`socket` | *any* |
`lobbies` | *any* |
`category` | *string* |
`message` | *any* |

**Returns:** *Promise*<*boolean*\>

Defined in: [common.ts:69](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L69)

___

### startNewRound

▸ **startNewRound**(`host`: *string*, `word`: *any*, `lobbies`: *any*, `lobbyCode`: *string*, `lobbySettings`: *any*): *Promise*<{ `lobbies`: *undefined* ; `message`: *any* ; `ok`: *boolean* = false; `result`: *undefined* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = false; `result`: *any* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = true; `result`: *any* ; `roundId`: *any*  }\>

#### Parameters:

Name | Type |
------ | ------ |
`host` | *string* |
`word` | *any* |
`lobbies` | *any* |
`lobbyCode` | *string* |
`lobbySettings` | *any* |

**Returns:** *Promise*<{ `lobbies`: *undefined* ; `message`: *any* ; `ok`: *boolean* = false; `result`: *undefined* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = false; `result`: *any* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = true; `result`: *any* ; `roundId`: *any*  }\>

Defined in: [common.ts:158](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L158)

___

### updatePlayerToken

▸ **updatePlayerToken**(`io`: *any*, `socket`: *any*, `p_id`: *string*, `name`: *string*, `definition`: *string* \| *undefined*, `points`: *number* \| *undefined*, `lobbyCode`: *string*): *Promise*<*any*\>

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`io` | *any* | (socket io)   |
`socket` | *any* | (socket io)   |
`p_id` | *string* | Player UUID   |
`name` | *string* | Player's username   |
`definition` | *string* \| *undefined* | Player's definition   |
`points` | *number* \| *undefined* | Player's points   |
`lobbyCode` | *string* | Players current game code    |

**Returns:** *Promise*<*any*\>

Defined in: [common.ts:263](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L263)

___

### whereAmI

▸ **whereAmI**(`socket`: *any*): lobbyCode

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`socket` | *any* | (socket io)   |

**Returns:** lobbyCode

the lobby code attached to this socket (string).

Defined in: [common.ts:216](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L216)

___

### wordFromID

▸ **wordFromID**(`id`: *any*): *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

#### Parameters:

Name | Type |
------ | ------ |
`id` | *any* |

**Returns:** *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

Defined in: [common.ts:144](https://github.com/story-squad/tricktionary-be/blob/8c9d49b/src/sockets/common.ts#L144)
