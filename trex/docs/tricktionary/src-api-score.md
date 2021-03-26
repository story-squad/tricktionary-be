**score**

The score cards collect data as the game unfolds

| Method | URL                          | Description      |
| ------ | ---------------------------- | ---------------- |
| GET    | /api/score/latest/${GAME_ID} | the latest score |

Returns:

```
[
    {
        "player_id": "45894df8-9420-470f-819d-c81cf2883bc8",
        "points": 2,
        "top_definition_id": 40
    },
    {
        "player_id": "342a8db6-1a00-4809-a122-37535972e8d0",
        "points": 1,
        "top_definition_id": 42
    },
    {
        "player_id": "d51cea91-3107-41d3-9134-346336b085c1",
        "points": 0,
        "top_definition_id": 41
    },
    {
        "player_id": "88124fba-4a54-4275-a324-3b5228a36e11",
        "points": 0,
        "top_definition_id": null
    }
]
```

| Method | URL                                                  | Description      |
| ------ | ---------------------------------------------------- | ---------------- |
| GET    | /api/definitions/game/${GAME_ID}/player/${PLAYER_ID} | player's top definition |


```
{
    "top_definition": {
        "id": 42,
        "user_id": "Bu0Ms8pUmM0W4sbAAAAN",
        "definition": "silly string",
        "round_id": 13,
        "created_at": "2021-03-26T01:01:19.593Z",
        "updated_at": "2021-03-26T01:01:19.593Z",
        "score": 0,
        "player_id": "7a81148e-e750-4a4f-babf-932a9fd9c189",
        "game_id": "3886d481-0160-45c3-97f0-f81f9e01e062"
    }
}
```
