# tricktionary-be

TypeScript Express API
- ported from [this original JavaScript Express API](https://github.com/christiano39/trictionary_be)

#

**Requirements**

- NodeJS
- a PostGreSQL server

#
**Environment**

    PORT=5000
    DATABASE_URL=postgresql://user:pass@localhost:5432/
    BASE_URL=http://0.0.0.0

#
**Install**

![install](install.gif)

    git clone https://github.com/story-squad/tricktionary-be

    cd tricktionary-be

    npm install

#

**Commands**

    npm run-script develop

- Build; then start the app. (used primarily during development)
#
    npm run-script build

- Clean, lint, & transpile TS -> JS.
#
    npm start

- start the app.
#
    npm run-script package

Create a release .zip archive:
- include knex data/
- patch package.json for a stand-alone release
- time-stamped filename
- *requires .env file
#
![zip](zip.gif)

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
| Resource | Description |
|--------| ------------|
|[sockets](src/sockets/README.md)| overview of event handlers |

