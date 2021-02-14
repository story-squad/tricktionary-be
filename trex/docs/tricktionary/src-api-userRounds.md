**User Rounds**

***called from handleStartGame***

|Method | URL | Description |
|-------|-----|-------------|
| POST  | /api/user-rounds/add-players | add these players to this round |

Request body:
```
{
    players: [{...},],
    roundId : 12
}
```
Returns:
```
{
    "message": "...status message"
}
```
