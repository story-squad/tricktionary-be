---
id: database
title: Database Considerations
---

## designed to support anonymous players.

![img](../static/img/entitydiagram.jpg)

:::note

the Played table was created to illustrate connecting a player with a game. It contains no records at the moment and may disappear in future releases.

:::

## Player

The Player record represents an anonymous player securely connected via websocket over HTTPS.
