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
- [doIt](common.md#doit)
- [gameExists](common.md#gameexists)
- [getDef](common.md#getdef)
- [playerIdWasHost](common.md#playeridwashost)
- [playerIsHost](common.md#playerishost)
- [privateMessage](common.md#privatemessage)
- [sendToHost](common.md#sendtohost)
- [startNewRound](common.md#startnewround)
- [tieBreakerMatch](common.md#tiebreakermatch)
- [updatePlayerToken](common.md#updateplayertoken)
- [whereAmI](common.md#whereami)
- [wordFromID](common.md#wordfromid)

## Variables

### LC\_LENGTH

• `Const` **LC\_LENGTH**: *number*

Number of characters in lobbyCode

Defined in: [common.ts:21](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L21)

___

### MAX\_PLAYERS

• `Const` **MAX\_PLAYERS**: *string* \| *30*

maximum number of players per lobby

Defined in: [common.ts:16](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L16)

___

### VALUE\_OF\_BLUFF

• `Const` **VALUE\_OF\_BLUFF**: *number*

POINTS AWARDED when others choose your definition

Defined in: [common.ts:35](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L35)

___

### VALUE\_OF\_TRUTH

• `Const` **VALUE\_OF\_TRUTH**: *number*

POINTS AWARDED when you choose correctly

Defined in: [common.ts:28](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L28)

___

### b64

• `Const` **b64**: *object*

Base64 string operatoins

#### Type declaration:

Name | Type |
:------ | :------ |
`decode` | (`str`: *string*) => *string* |
`encode` | (`str`: *string*) => *string* |

Defined in: [common.ts:306](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L306)

___

### localAxios

• `Const` **localAxios**: AxiosInstance

Defined in: [common.ts:6](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L6)

## Functions

### checkSettings

▸ **checkSettings**(`settings`: *any*): { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

#### Parameters:

Name | Type |
:------ | :------ |
`settings` | *any* |

**Returns:** { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

Defined in: [common.ts:142](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L142)

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

Defined in: [common.ts:156](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L156)

___

### doIt

▸ **doIt**(`game_id`: *string*, `firstPlace`: *any*, `secondPlace?`: *any*, `thirdPlace?`: *any*): *Promise*<any[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`game_id` | *string* |
`firstPlace` | *any* |
`secondPlace?` | *any* |
`thirdPlace?` | *any* |

**Returns:** *Promise*<any[]\>

Defined in: [common.ts:370](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L370)

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

Defined in: [common.ts:314](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L314)

___

### getDef

▸ **getDef**(`user_id`: *string*, `definitionId`: *number*): *Promise*<undefined \| { `definition`: *any* ; `user_id`: *string* ; `word`: *any*  }\>

#### Parameters:

Name | Type |
:------ | :------ |
`user_id` | *string* |
`definitionId` | *number* |

**Returns:** *Promise*<undefined \| { `definition`: *any* ; `user_id`: *string* ; `word`: *any*  }\>

Defined in: [common.ts:61](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L61)

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

Defined in: [common.ts:133](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L133)

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

Defined in: [common.ts:124](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L124)

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

Defined in: [common.ts:91](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L91)

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

Defined in: [common.ts:106](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L106)

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

Defined in: [common.ts:222](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L222)

___

### tieBreakerMatch

▸ **tieBreakerMatch**(`checkPoints`: *any*[], `game_id`: *string*, `lobbies`: *any*[], `lobbyCode`: *any*): *Promise*<any[]\>

#### Parameters:

Name | Type |
:------ | :------ |
`checkPoints` | *any*[] |
`game_id` | *string* |
`lobbies` | *any*[] |
`lobbyCode` | *any* |

**Returns:** *Promise*<any[]\>

Defined in: [common.ts:415](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L415)

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

Defined in: [common.ts:328](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L328)

___

### whereAmI

▸ **whereAmI**(`socket`: *any*): lobbyCode

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`socket` | *any* | (socket io)   |

**Returns:** lobbyCode

the lobby code attached to this socket (string).

Defined in: [common.ts:283](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L283)

___

### wordFromID

▸ **wordFromID**(`id`: *any*): *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *any* |

**Returns:** *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

Defined in: [common.ts:181](https://github.com/story-squad/tricktionary-be/blob/0b1420e/src/sockets/common.ts#L181)
