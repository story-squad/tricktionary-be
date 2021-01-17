**User Rounds**



|Method | URL | Description |
|-------|-----|-------------|
| POST  | /api/round/start | start a new round. ***called from handleStartGame***|
| POST  | /api/round/finish | finish this round. ***called from handleGuess*** |

#

### POST /api/round/start
Request body:
```
{
    lobby: {...},
    wordId: 42
}
```
Returns:
```
{
    roundId: 13
}
```
#

### POST /api/round/finish
Request body:
```
{
    roundId: 13
}
```