[tricktionary-be](../README.md) / [Exports](../modules.md) / crontab

# Module: crontab

## Table of contents

### Interfaces

- [cronTask](../interfaces/crontab.crontask.md)
- [cronTaskIndex](../interfaces/crontab.crontaskindex.md)

### Variables

- [lobbyTasks](crontab.md#lobbytasks)

### Functions

- [deleteScheduledTask](crontab.md#deletescheduledtask)
- [getScheduledTask](crontab.md#getscheduledtask)
- [schedulePulseCheck](crontab.md#schedulepulsecheck)
- [scheduleTimer](crontab.md#scheduletimer)
- [startScheduledTask](crontab.md#startscheduledtask)
- [stopScheduledTask](crontab.md#stopscheduledtask)

## Variables

### lobbyTasks

• `Const` **lobbyTasks**: [*cronTaskIndex*](../interfaces/crontab.crontaskindex.md)

Defined in: [crontab.ts:39](https://github.com/story-squad/tricktionary-be/blob/c6eb6c8/src/sockets/crontab.ts#L39)

## Functions

### deleteScheduledTask

▸ **deleteScheduledTask**(`taskName`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`taskName` | *string* |

**Returns:** *void*

Defined in: [crontab.ts:119](https://github.com/story-squad/tricktionary-be/blob/c6eb6c8/src/sockets/crontab.ts#L119)

___

### getScheduledTask

▸ **getScheduledTask**(`lobbyCode`: *string*): [*cronTask*](../interfaces/crontab.crontask.md)

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** [*cronTask*](../interfaces/crontab.crontask.md)

a Tricktionary scheduled-task

Defined in: [crontab.ts:143](https://github.com/story-squad/tricktionary-be/blob/c6eb6c8/src/sockets/crontab.ts#L143)

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

Defined in: [crontab.ts:66](https://github.com/story-squad/tricktionary-be/blob/c6eb6c8/src/sockets/crontab.ts#L66)

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

Defined in: [crontab.ts:153](https://github.com/story-squad/tricktionary-be/blob/c6eb6c8/src/sockets/crontab.ts#L153)

___

### startScheduledTask

▸ **startScheduledTask**(`lobbyCode`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** *void*

Defined in: [crontab.ts:130](https://github.com/story-squad/tricktionary-be/blob/c6eb6c8/src/sockets/crontab.ts#L130)

___

### stopScheduledTask

▸ **stopScheduledTask**(`lobbyCode`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** *void*

Defined in: [crontab.ts:109](https://github.com/story-squad/tricktionary-be/blob/c6eb6c8/src/sockets/crontab.ts#L109)
