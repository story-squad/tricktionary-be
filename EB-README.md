# Tricktionary & The Elastic Beanstalk.

a StorySquad API

**Starring**
- NodeJS
- TypeScript
- Express
- Knex
- SocketIO

**Deployed by**
- eb CLI

**Extended with**
- [node-settings](.ebextensions/node-settings.config)
- [custom_nginx](.ebextensions/custom_nginx.config)
- [logging](.ebextensions/logging.config)
#

To deploy this on elastic beanstalk, download and install the eb CLI.
#

**initialize and create the environment**

```
eb init --platform node.js --region us-east-1


eb create
```
# 

**develop, build, test**

```
npm run build
```
```
npm run start
```
#
**Deploy via eb CLI**
```
eb deploy
```
