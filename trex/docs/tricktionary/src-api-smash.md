**smash**

emoji smash

| Method | URL                          | Description      |
| ------ | ---------------------------- | ---------------- |
| GET    | /api/smash/totals/${GAME_ID}/${ROUND_ID} | smash record |

Returns:

```
[
    {
        "id": 1,
        "created_at": "2021-03-26T00:48:49.038Z",
        "game_id": "ecf8a1d8-30e1-4d6c-9597-03e5d9b96db1",
        "round_id": 11,
        "definition_id": 22,
        "reaction_id": 8,
        "count": 10
    },
    {
        "id": 2,
        "created_at": "2021-03-26T00:48:51.966Z",
        "game_id": "ecf8a1d8-30e1-4d6c-9597-03e5d9b96db1",
        "round_id": 11,
        "definition_id": 22,
        "reaction_id": 13,
        "count": 13
    },
    ...
]
```
