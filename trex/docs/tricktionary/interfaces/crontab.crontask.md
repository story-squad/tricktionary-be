[tricktionary-be](../README.md) / [Exports](../modules.md) / [crontab](../modules/crontab.md) / cronTask

# Interface: cronTask

[crontab](../modules/crontab.md).cronTask

a Tricktionary scheduled-task

**`name`** - semantic name of this task; ie "pulse check"

**`lobbycode`** - location code of game requiring this task

**`limit`** - maximum number of times to run this task

**`count`** - number of times this task has been run

**`created`** - timestamp when this task was created

**`last`** - timestamp when this task was last run

**`task`** - cron.ScheduledTask

## Table of contents

### Properties

- [count](crontab.crontask.md#count)
- [created](crontab.crontask.md#created)
- [last](crontab.crontask.md#last)
- [limit](crontab.crontask.md#limit)
- [lobbyCode](crontab.crontask.md#lobbycode)
- [name](crontab.crontask.md#name)
- [task](crontab.crontask.md#task)

## Properties

### count

• **count**: *number*

Defined in: [crontab.ts:26](https://github.com/story-squad/tricktionary-be/blob/855fef0/src/sockets/crontab.ts#L26)

___

### created

• **created**: *number*

Defined in: [crontab.ts:27](https://github.com/story-squad/tricktionary-be/blob/855fef0/src/sockets/crontab.ts#L27)

___

### last

• **last**: *number*

Defined in: [crontab.ts:28](https://github.com/story-squad/tricktionary-be/blob/855fef0/src/sockets/crontab.ts#L28)

___

### limit

• **limit**: *number*

Defined in: [crontab.ts:25](https://github.com/story-squad/tricktionary-be/blob/855fef0/src/sockets/crontab.ts#L25)

___

### lobbyCode

• **lobbyCode**: *string*

Defined in: [crontab.ts:24](https://github.com/story-squad/tricktionary-be/blob/855fef0/src/sockets/crontab.ts#L24)

___

### name

• **name**: *string*

Defined in: [crontab.ts:23](https://github.com/story-squad/tricktionary-be/blob/855fef0/src/sockets/crontab.ts#L23)

___

### task

• **task**: *ScheduledTask*

Defined in: [crontab.ts:29](https://github.com/story-squad/tricktionary-be/blob/855fef0/src/sockets/crontab.ts#L29)
