**Reactions**



|Method | URL | Description |
|-------|-----|-------------|
| GET   | /api/reactions | available emoji reactions |

#

### GET /api/reactions
Returns:
```
{ "available": [
    {"id":1,"content":"👍"},
    {"id":2,"content":"😂"},
    {"id":3,"content":"😁"},
    {"id":4,"content":"😎"},
    {"id":5,"content":"🤔"},
    {"id":6,"content":"😍"},
    {"id":7,"content":"😴"},
    {"id":8,"content":"😬"},
    {"id":9,"content":"🙃"},
    ...
    ]
}
```