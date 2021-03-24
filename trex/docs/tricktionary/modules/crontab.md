[tricktionary-be](../README.md) / [Exports](../modules.md) / crontab

# Module: crontab

## Table of contents

### Interfaces

- [cronTask](../interfaces/crontab.crontask.md)
- [cronTaskIndex](../interfaces/crontab.crontaskindex.md)

### Variables

- [lobbyTasks](crontab.md#lobbytasks)

### Functions

- [getScheduledTask](crontab.md#getscheduledtask)
- [schedulePulseCheck](crontab.md#schedulepulsecheck)
- [scheduleTimer](crontab.md#scheduletimer)
- [startScheduledTask](crontab.md#startscheduledtask)
- [stopScheduledTask](crontab.md#stopscheduledtask)

## Variables

### lobbyTasks

• `Const` **lobbyTasks**: [*cronTaskIndex*](../interfaces/crontab.crontaskindex.md)

<<<<<<< HEAD
Defined in: [crontab.ts:39](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/crontab.ts#L39)
=======
Defined in: [crontab.ts:39](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/crontab.ts#L39)
>>>>>>> remotePaint

## Functions

### getScheduledTask

▸ **getScheduledTask**(`lobbyCode`: *string*): [*cronTask*](../interfaces/crontab.crontask.md)

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** [*cronTask*](../interfaces/crontab.crontask.md)

a Tricktionary scheduled-task

<<<<<<< HEAD
Defined in: [crontab.ts:143](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/crontab.ts#L143)
=======
Defined in: [crontab.ts:133](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/crontab.ts#L133)
>>>>>>> remotePaint

___

### schedulePulseCheck

▸ **schedulePulseCheck**(`io`: *any*, `lobbies`: *any*, `lobbyCode`: *string*, `limit`: *number*): *void*

schedule a 'pulse check' for re-connected players in this game (lobbyCode)

creates a Tricktionary scheduled-task

#### Parameters:

Name | Type |
:------ | :------ |
`io` | *any* |
`lobbies` | *any* |
`lobbyCode` | *string* |
`limit` | *number* |

**Returns:** *void*

<<<<<<< HEAD
Defined in: [crontab.ts:69](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/crontab.ts#L69)
=======
Defined in: [crontab.ts:67](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/crontab.ts#L67)
>>>>>>> remotePaint

___

### scheduleTimer

▸ **scheduleTimer**(`io`: *any*, `lobbyCode`: *string*, `limit`: *number*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`io` | *any* |
`lobbyCode` | *string* |
`limit` | *number* |

**Returns:** *void*

<<<<<<< HEAD
Defined in: [crontab.ts:153](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/crontab.ts#L153)
=======
Defined in: [crontab.ts:143](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/crontab.ts#L143)
>>>>>>> remotePaint

___

### startScheduledTask

▸ **startScheduledTask**(`lobbyCode`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** *void*

<<<<<<< HEAD
Defined in: [crontab.ts:130](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/crontab.ts#L130)
=======
Defined in: [crontab.ts:120](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/crontab.ts#L120)
>>>>>>> remotePaint

___

### stopScheduledTask

▸ **stopScheduledTask**(`lobbyCode`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** *void*

<<<<<<< HEAD
Defined in: [crontab.ts:120](https://github.com/story-squad/tricktionary-be/blob/e2df648/src/sockets/crontab.ts#L120)
=======
Defined in: [crontab.ts:110](https://github.com/story-squad/tricktionary-be/blob/50f8f84/src/sockets/crontab.ts#L110)
>>>>>>> remotePaint
