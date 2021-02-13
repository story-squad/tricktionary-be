**Player**

| Method | URL                  | Description             |
| ------ | -------------------- | ----------------------- |
| GET    | /api/player/id/:UUID | lookup by player's uuid |
| GET    | /api/player/last-user-id/:SOCKET.ID | lookup by player's last user_id |
Returns:

```
{
  "player":
    {
      "id": UUID,
      "token": TOKEN,
      "last_played": LOBBYCODE,
      "last_user_id": SOCKET.ID,
      "jump_code": UNUSED, 
      "name": USERNAME,
      "created_at": TIMESTAMP 
      }
    }
```
| Method | URL                  | Description             |
| ------ | -------------------- | ----------------------- |
| PUT    | /api/player/id/:UUID | update a player's record |

Request body (any of):
```
{
  "token": TOKEN,
  "last_played": LOBBYCODE,
  "last_user_id": SOCKET.ID,
  "jump_code": UNUSED, 
  "name": USERNAME,
}
```
Returns (updated):
```
{
  "player":
    {
      "id": UUID,
      "token": TOKEN,
      "last_played": LOBBYCODE,
      "last_user_id": SOCKET.ID,
      "jump_code": UNUSED, 
      "name": USERNAME,
      "created_at": TIMESTAMP 
      }
    }
```