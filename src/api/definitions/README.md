**Definitions**

|Method | URL | Description |
|-------|-----|-------------|
| POST  | /api/definitions/new | ***called from handleSubmitDefinition***|

#

### POST /api/definitions/new
Request body:
```
{ 
    playerId: WAKAwakaWAKA,
    definition: "a well documented app", 
    roundId: 13
}
```
Returns:
```
{
    definitionId: 1357
}
```
