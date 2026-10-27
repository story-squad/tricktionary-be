**smash**

emoji smash

| Method | URL                          | Description      |
| ------ | ---------------------------- | ---------------- |
| PUT    | /api/smash/emoji/${LOBBY_CODE} | count one reaction |
| GET    | /api/smash/totals/${GAME_ID}/${ROUND_ID} | smash record |

Reactions are counted in the `Smash` table, and the totals are read from it.

### PUT /api/smash/emoji/${LOBBY_CODE}

Request body:

```
{
    "game_id": "ecf8a1d8-30e1-4d6c-9597-03e5d9b96db1",
    "roundId": 11,
    "definitionId": 22,
    "reactionId": 8
}
```

Returns the new total for that reaction to that definition:

```
{ "value": 11 }
```

### GET /api/smash/totals/${GAME_ID}/${ROUND_ID}

Returns one entry per definition and reaction, sorted by definition, then reaction; `value` and `count` are the same total:

```
[
    {
        "game_id": "ecf8a1d8-30e1-4d6c-9597-03e5d9b96db1",
        "round_id": 11,
        "definition_id": 22,
        "reaction_id": 8,
        "value": 10,
        "count": 10
    },
    {
        "game_id": "ecf8a1d8-30e1-4d6c-9597-03e5d9b96db1",
        "round_id": 11,
        "definition_id": 22,
        "reaction_id": 13,
        "value": 13,
        "count": 13
    },
    ...
]
```
