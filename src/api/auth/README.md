**Auth**

| Method | URL                  | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | /api/auth/new-player | create a new player record |

Returns:

```
{
  "player":
    {
      "id": UUID,
      "token": TOKEN,
      "last_played": "update me",
      "last_user_id": SOCKET.ID,
      "jump_code": UNUSED,
      "name": UNUSED,
      "created_at": TIMESTAMP (now)
      }
    }
```

| Method | URL                    | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | /api/auth/update-token | update a player's token |

Request body (any of):

```
  {
    s_id,
    p_id,
    name,
    definition,
    points
  }
```
Returns:
```
  { 
    "token": TOKEN 
  }
```

| Method | URL                        | Description                       |
| ------ | -------------------------- | --------------------------------- |
| GET    | /find-player/:last_user_id | lookup by player's last socket id |

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

| Method | URL    | Description               |
| ------ | ------ | ------------------------- |
| POST   | /login | connect with Tricktionary |

Request body:

```
  {
    "user_id": SOCKET.ID,
    "last_token": TOKEN
  }
```

Returns:
```
  {
    "message": "welcome",
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
    "token": NEW TOKEN,
  }
```
