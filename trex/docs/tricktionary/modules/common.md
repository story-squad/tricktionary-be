[tricktionary-be](../README.md) / [Exports](../modules.md) / common

# Module: common

## Table of contents

### Variables

- [LC\_LENGTH](common.md#lc_length)
- [MAX\_PLAYERS](common.md#max_players)
- [VALUE\_OF\_BLUFF](common.md#value_of_bluff)
- [VALUE\_OF\_TRUTH](common.md#value_of_truth)
- [b64](common.md#b64)
- [localAxios](common.md#localaxios)

### Functions

- [checkSettings](common.md#checksettings)
- [contributeWord](common.md#contributeword)
- [gameExists](common.md#gameexists)
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

• `Const` **LC\_LENGTH**: *number*

Number of characters in lobbyCode

Defined in: [common.ts:21](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L21)

___

### MAX\_PLAYERS

• `Const` **MAX\_PLAYERS**: *string* \| *30*

maximum number of players per lobby

Defined in: [common.ts:16](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L16)

___

### VALUE\_OF\_BLUFF

• `Const` **VALUE\_OF\_BLUFF**: *number*

POINTS AWARDED when others choose your definition

Defined in: [common.ts:35](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L35)

___

### VALUE\_OF\_TRUTH

• `Const` **VALUE\_OF\_TRUTH**: *number*

POINTS AWARDED when you choose correctly

Defined in: [common.ts:28](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L28)

___

### b64

• `Const` **b64**: *object*

Base64 string operatoins

#### Type declaration:

Name | Type |
:------ | :------ |
`decode` | (`str`: *string*) => *string* |
`encode` | (`str`: *string*) => *string* |

Defined in: [common.ts:255](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L255)

___

### localAxios

• `Const` **localAxios**: AxiosInstance

Defined in: [common.ts:6](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L6)

## Functions

### checkSettings

▸ **checkSettings**(`settings`: *any*): { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

#### Parameters:

Name | Type |
:------ | :------ |
`settings` | *any* |

**Returns:** { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

Defined in: [common.ts:121](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L121)

___

### contributeWord

▸ **contributeWord**(`word`: *string*, `definition`: *string*, `source`: *string*): *Promise*<{ `definition`: *string* ; `id`: *number* = 0; `source`: *string* ; `word`: *string*  }\>

#### Parameters:

Name | Type |
:------ | :------ |
`word` | *string* |
`definition` | *string* |
`source` | *string* |

**Returns:** *Promise*<{ `definition`: *string* ; `id`: *number* = 0; `source`: *string* ; `word`: *string*  }\>

Defined in: [common.ts:135](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L135)

___

### gameExists

▸ **gameExists**(`lobbyCode`: *string*, `lobbies`: *any*): *boolean*

returns true if LobbyCode can be found in Lobbies

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`lobbyCode` | *string* | LobbyCode of game   |
`lobbies` | *any* | socket-handler games    |

**Returns:** *boolean*

Defined in: [common.ts:263](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L263)

___

### playerIdWasHost

▸ **playerIdWasHost**(`playerId`: *string*, `lobbyCode`: *any*, `lobbies`: *any*): { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

#### Parameters:

Name | Type |
:------ | :------ |
`playerId` | *string* |
`lobbyCode` | *any* |
`lobbies` | *any* |

**Returns:** { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

Defined in: [common.ts:112](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L112)

___

### playerIsHost

▸ **playerIsHost**(`socket`: *any*, `lobbyCode`: *any*, `lobbies`: *any*): { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

#### Parameters:

Name | Type |
:------ | :------ |
`socket` | *any* |
`lobbyCode` | *any* |
`lobbies` | *any* |

**Returns:** { `message`: *undefined* ; `ok`: *boolean*  } \| { `message`: *any* ; `ok`: *boolean* = false }

Defined in: [common.ts:103](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L103)

___

### privateMessage

▸ **privateMessage**(`io`: *any*, `socket`: *any*, `listener`: *string*, `message`: *string*): *Promise*<void\>

send message to socket.id

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | any (socketio)   |
`socket` | *any* | any (socketio)   |
`listener` | *string* | string   |
`message` | *string* | string  helper function; not directly exposed to the public.  please handle all necessary authority role checks, prior to invocation.    |

**Returns:** *Promise*<void\>

Defined in: [common.ts:70](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L70)

___

### sendToHost

▸ **sendToHost**(`io`: *any*, `socket`: *any*, `lobbies`: *any*, `category`: *string*, `message`: *any*): *Promise*<boolean\>

#### Parameters:

Name | Type |
:------ | :------ |
`io` | *any* |
`socket` | *any* |
`lobbies` | *any* |
`category` | *string* |
`message` | *any* |

**Returns:** *Promise*<boolean\>

Defined in: [common.ts:85](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L85)

___

### startNewRound

▸ **startNewRound**(`host`: *string*, `word`: *any*, `lobbies`: *any*, `lobbyCode`: *string*, `lobbySettings`: *any*): *Promise*<{ `lobbies`: *undefined* ; `message`: *any* ; `ok`: *boolean* = false; `result`: *undefined* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = false; `result`: *any* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = true; `result`: *any* ; `roundId`: *any*  }\>

#### Parameters:

Name | Type |
:------ | :------ |
`host` | *string* |
`word` | *any* |
`lobbies` | *any* |
`lobbyCode` | *string* |
`lobbySettings` | *any* |

**Returns:** *Promise*<{ `lobbies`: *undefined* ; `message`: *any* ; `ok`: *boolean* = false; `result`: *undefined* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = false; `result`: *any* ; `roundId`: *undefined*  } \| { `lobbies`: *any* ; `message`: *undefined* ; `ok`: *boolean* = true; `result`: *any* ; `roundId`: *any*  }\>

Defined in: [common.ts:174](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L174)

___

### updatePlayerToken

▸ **updatePlayerToken**(`io`: *any*, `socket`: *any*, `p_id`: *string*, `name`: *string*, `definition`: *string* \| *undefined*, `points`: *number* \| *undefined*, `lobbyCode`: *string*, `info?`: *string*): *Promise*<any\>

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`io` | *any* | (socket io)   |
`socket` | *any* | (socket io)   |
`p_id` | *string* | Player UUID   |
`name` | *string* | Player's username   |
`definition` | *string* \| *undefined* | Player's definition   |
`points` | *number* \| *undefined* | Player's points   |
`lobbyCode` | *string* | Players current game code    |
`info?` | *string* | - |

**Returns:** *Promise*<any\>

Defined in: [common.ts:277](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L277)

___

### whereAmI

▸ **whereAmI**(`socket`: *any*): lobbyCode

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`socket` | *any* | (socket io)   |

**Returns:** lobbyCode

the lobby code attached to this socket (string).

Defined in: [common.ts:232](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L232)

___

### wordFromID

▸ **wordFromID**(`id`: *any*): *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *any* |

**Returns:** *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

Defined in: [common.ts:160](https://github.com/story-squad/tricktionary-be/blob/fa87e4f/src/sockets/common.ts#L160)
