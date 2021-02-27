[tricktionary-be](../README.md) / [Exports](../modules.md) / crontab

# Module: crontab

## Table of contents

### Interfaces

- [cronTask](../interfaces/crontab.crontask.md)
- [cronTaskIndex](../interfaces/crontab.crontaskindex.md)

### Variables

- [lobbyTasks](crontab.md#lobbytasks)

### Functions

- [destroyScheduledTask](crontab.md#destroyscheduledtask)
- [getScheduledTask](crontab.md#getscheduledtask)
- [schedulePulseCheck](crontab.md#schedulepulsecheck)
- [startScheduledTask](crontab.md#startscheduledtask)
- [stopScheduledTask](crontab.md#stopscheduledtask)

## Variables

### lobbyTasks

• `Const` **lobbyTasks**: [*cronTaskIndex*](../interfaces/crontab.crontaskindex.md)

Defined in: [crontab.ts:39](https://github.com/story-squad/tricktionary-be/blob/9729e8f/src/sockets/crontab.ts#L39)

## Functions

### destroyScheduledTask

▸ **destroyScheduledTask**(`lobbyCode`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** *void*

Defined in: [crontab.ts:104](https://github.com/story-squad/tricktionary-be/blob/9729e8f/src/sockets/crontab.ts#L104)

___

### getScheduledTask

▸ **getScheduledTask**(`lobbyCode`: *string*): [*cronTask*](../interfaces/crontab.crontask.md)

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** [*cronTask*](../interfaces/crontab.crontask.md)

a Tricktionary scheduled-task

Defined in: [crontab.ts:128](https://github.com/story-squad/tricktionary-be/blob/9729e8f/src/sockets/crontab.ts#L128)

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

Defined in: [crontab.ts:46](https://github.com/story-squad/tricktionary-be/blob/9729e8f/src/sockets/crontab.ts#L46)

___

### startScheduledTask

▸ **startScheduledTask**(`lobbyCode`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** *void*

Defined in: [crontab.ts:115](https://github.com/story-squad/tricktionary-be/blob/9729e8f/src/sockets/crontab.ts#L115)

___

### stopScheduledTask

▸ **stopScheduledTask**(`lobbyCode`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`lobbyCode` | *string* |

**Returns:** *void*

Defined in: [crontab.ts:94](https://github.com/story-squad/tricktionary-be/blob/9729e8f/src/sockets/crontab.ts#L94)
