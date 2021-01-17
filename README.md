# tricktionary-be

TypeScript Express API
- ported from [this original JavaScript Express API](https://github.com/christiano39/trictionary_be)

#

**Requirements**

- NodeJS
- a PostGreSQL server

#

**Install**


    git clone https://github.com/ss-mvp/tricktionary-be

    cd tricktionary

    npm install

#

**Commands**

    npm run start

Clean, lint, transpile, and start the server.

#

**Environment**

    PORT=5000
    DATABASE_URL=postgresql://user:pass@localhost:5432/
    BASE_URL=http://0.0.0.0

#
**Endpoints**
| Path | Resource |
|------| ------------|
|[/api/words](src/api/words/README.md)| Words |
|[/api/votes](src/api/votes/README.md)| Votes |
|[/api/user-rounds/](src/api/userRounds/README.md)| User Rounds|
|[/api/round/](src/api/rounds/README.md)| Rounds
|[/api/reactions](src/api/reactions/README.md)| Reactions
|[/api/definitions](src/api/definitions/README.md)| Definitions
|[/api/definition-reactions](src/api/definitionReactions/README.md)|Definition Reactions

#
**Web Sockets**
| Resource | Desctiption |
|--------| ------------|
|[sockets](src/sockets/README.md)| overview of event handlers |

