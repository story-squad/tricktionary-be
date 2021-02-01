***docker-compose*** reads the [docker-compose.yml](docker-compose.yml), 

and wil require an additional option when run from another folder.

```
docker-compose -f docker/docker-compose.yml
```

#
**setting up a postgres docker container**

1. create a file that we will overwrite with the Postgres configuration file.

```
touch /tmp/postgres.conf
```
2. raise the docker image. this will pull the official postgres container from the docker cloud.
```
docker-compose up -d
```
3. lower the image
```
docker-compose down --remove-orphans
```

4. overwrite the postgres.conf with sample from container.
```
docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > /tmp/postgres.conf
```
#
**running postgres**


- raise postgres and send it to the background.*
```
docker-compose up -d postgres
```

# 

**login to psql & ready the db (password=docker)**
```
psql -h localhost -p 5432 -U docker postgres
```
postgres=#
```
 CREATE user storysquad with encrypted password 'llama';
 CREATE database tricktionary;
 GRANT all privileges on database tricktionary to storysquad;
 \q
 ```
#
**knex**
```
npm install -g knex
```

```
npx knex migrate:latest
```
```
npx knex seed:run
```

