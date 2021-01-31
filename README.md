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

![install](gifs/install.gif)

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
![zip](gifs/zip.gif)

**Endpoints**
| Path | Resource |
|------| ------------|
|[/api/words](src/api/words)| Words |
|[/api/votes](src/api/votes)| Votes |
|[/api/user-rounds/](src/api/userRounds)| User Rounds|
|[/api/round/](src/api/rounds)| Rounds
|[/api/reactions](src/api/reactions)| Reactions
|[/api/definitions](src/api/definitions)| Definitions
|[/api/definition-reactions](src/api/definitionReactions)|Definition Reactions

#
**Web Sockets**
| Resource | Description |
|--------| ------------|
|[sockets](src/sockets)| event handlers |

**Docker support**
| Resource | Description |
|--------| ------------|
|[README](docker/README.md)| containerized development |
