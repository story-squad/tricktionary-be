**Votes**

|Method | URL | Description |
|-------|-----|-------------|
| POST  | /api/votes | player chooses a definition |

Request body:
```
{
    userID: WAKAwakaWAKA,
    definitionID: 7,
    roundID: 12,
}
```
Returns:
```
{
    "ok": true,
    "voteID": 0
}
```
