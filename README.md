# tricktionary-be

TypeScript Express API
- ported from [this original JavaScript Express API](https://github.com/christiano39/trictionary_be)

#

**UPDATED FOR AWS ELASTIC BEANSTALK...**
[READ ABOUT IT HERE!](EB-README.md)

**Requirements**

- NodeJS
- a PostGreSQL server

#
**local environment**

    PORT=8080
    DATABASE_URL=postgresql://user:pass@database:5432/
    BASE_URL=http://0.0.0.0

#
**Install**

![install](gifs/install.gif)

    git clone https://github.com/story-squad/tricktionary-be

    cd tricktionary-be

    npm install

#

**Commands**

#
    npm run build

- Clean, lint, & transpile TS -> JS.
#
    npm start

- start the app.
#

**Endpoints**
| Path | Resource |
|------| ------------|
|[/api/words](src/api/words)| Words |
|[/api/votes](src/api/votes)| Votes |
|[/api/user-rounds/](src/api/userRounds)| User Rounds|
|[/api/player/](src/api/player)| Player |
|[/api/round/](src/api/rounds)| Rounds
|[/api/reactions](src/api/reactions)| Reactions
|[/api/definitions](src/api/definitions)| Definitions
|[/api/definition-reactions](src/api/definitionReactions)|Definition Reactions

#
**Web Socket Handlers**

[table of contents](docs/README.md)
