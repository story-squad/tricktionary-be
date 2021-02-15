**Definition Reactions**

|Method | URL | Description |
|-------|-----|-------------|
| POST  | /api/definition-reactions | player reacted to a definition |
### POST /api/definition-reactions
Request body:
```
{
      user_id: WAKAwakaWAKA,
      round_id: 13,
      reaction_id: 2,
      definition_id: 1357,
      game_finished: false
}
```
Returns:
```
{
    "added" : true
}
```

