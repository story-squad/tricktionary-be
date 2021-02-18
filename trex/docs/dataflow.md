---
id: dataflow
title: Software Architecture
---
:::note

There are plenty of things to consider when designing a sleek new backend.
Security should always be considered first. 
:::

## Starting with a secure design.

:::tip

The separation of form and function provides us with our first layer of secure design.

:::

#

It's very tempting to just import a new technology and start coupling it with your resources.
More often than not, the story ends as a "lesson learned".

How to avoid that?

:::important

We obey our own rules.

:::

- Our database is limited to speaking with the RESTful API.

- websockets are limited to speaking with web servers.

- We connect the two by making API calls from websocket handlers, internally


No shortcuts.

Re-usable functions just seem to natually crop up due to these constraints.
