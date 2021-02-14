# Tricktionary & The Elastic Beanstalk.

a StorySquad API

**Starring**
- NodeJS
- TypeScript
- Express
- Knex
- SocketIO

**Deployed by**
- [eb CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html)
- [aws-elastic-beanstalk-cli](https://github.com/marketplace/actions/aws-elastic-beanstalk-cli)

#

To deploy this on elastic beanstalk, download and install the eb CLI. https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html#eb-cli3-install.scripts
#

**initialize and create the environment**

- generate your .elasticbeanstalk/config.yml and be sure to choose the Nodejs platform during the initialization process.
```
eb init
```
- create instance on the elastic beanstalk
```
eb create
```
# 

**develop, build, test**
- transpile the latest TypeScript
```
npm run build
```
- run locally and test
```
npm run start
```
#
**Deploymen via eb CLI**

After writing a new feature or fixing a broken piece of legacy code.

- make your pull request, then
```
eb deploy
```

#

*To simplify the deployment process, all transpiled code is committed.

<img src="gifs/Node.js_logo_2015.svg" width="42%" />

***Node.js 12 running on 64bit Amazon Linux 2/5.2.5***
