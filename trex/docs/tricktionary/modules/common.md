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

<<<<<<< HEAD
Defined in: [common.ts:21](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L21)
=======
Defined in: [common.ts:21](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L21)
>>>>>>> remotePaint

___

### MAX\_PLAYERS

• `Const` **MAX\_PLAYERS**: *string* \| *30*

maximum number of players per lobby

<<<<<<< HEAD
Defined in: [common.ts:16](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L16)
=======
Defined in: [common.ts:16](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L16)
>>>>>>> remotePaint

___

### VALUE\_OF\_BLUFF

• `Const` **VALUE\_OF\_BLUFF**: *number*

POINTS AWARDED when others choose your definition

<<<<<<< HEAD
Defined in: [common.ts:35](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L35)
=======
Defined in: [common.ts:35](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L35)
>>>>>>> remotePaint

___

### VALUE\_OF\_TRUTH

• `Const` **VALUE\_OF\_TRUTH**: *number*

POINTS AWARDED when you choose correctly

<<<<<<< HEAD
Defined in: [common.ts:28](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L28)
=======
Defined in: [common.ts:28](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L28)
>>>>>>> remotePaint

___

### b64

• `Const` **b64**: *object*

Base64 string operatoins

#### Type declaration:

Name | Type |
:------ | :------ |
`decode` | (`str`: *string*) => *string* |
`encode` | (`str`: *string*) => *string* |

<<<<<<< HEAD
Defined in: [common.ts:285](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L285)
=======
Defined in: [common.ts:255](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L255)
>>>>>>> remotePaint

___

### localAxios

• `Const` **localAxios**: AxiosInstance

<<<<<<< HEAD
Defined in: [common.ts:6](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L6)
=======
Defined in: [common.ts:6](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L6)
>>>>>>> remotePaint

## Functions

### checkSettings

▸ **checkSettings**(`settings`: *any*): { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

#### Parameters:

Name | Type |
:------ | :------ |
`settings` | *any* |

**Returns:** { `message`: *any* ; `ok`: *boolean* = false; `settings`: *any*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `settings`: *any*  }

<<<<<<< HEAD
Defined in: [common.ts:121](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L121)
=======
Defined in: [common.ts:121](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L121)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:135](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L135)
=======
Defined in: [common.ts:135](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L135)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:293](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L293)
=======
Defined in: [common.ts:263](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L263)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:112](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L112)
=======
Defined in: [common.ts:112](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L112)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:103](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L103)
=======
Defined in: [common.ts:103](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L103)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:70](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L70)
=======
Defined in: [common.ts:70](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L70)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:85](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L85)
=======
Defined in: [common.ts:85](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L85)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:201](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L201)
=======
Defined in: [common.ts:174](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L174)
>>>>>>> remotePaint

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

<<<<<<< HEAD
Defined in: [common.ts:307](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L307)
=======
Defined in: [common.ts:277](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L277)
>>>>>>> remotePaint

___

### whereAmI

▸ **whereAmI**(`socket`: *any*): lobbyCode

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`socket` | *any* | (socket io)   |

**Returns:** lobbyCode

the lobby code attached to this socket (string).

<<<<<<< HEAD
Defined in: [common.ts:262](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L262)
=======
Defined in: [common.ts:232](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L232)
>>>>>>> remotePaint

___

### wordFromID

▸ **wordFromID**(`id`: *any*): *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *any* |

**Returns:** *Promise*<{ `message`: *any* ; `ok`: *boolean* = false; `word`: *undefined*  } \| { `message`: *undefined* ; `ok`: *boolean* = true; `word`: *any*  }\>

<<<<<<< HEAD
Defined in: [common.ts:160](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/common.ts#L160)
=======
Defined in: [common.ts:160](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/common.ts#L160)
>>>>>>> remotePaint
