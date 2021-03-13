

# A

**copy the postgres.conf from the official docker container to the parent folder of this project**
```
docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > ../../postgres.conf
```

# B
**run the containers**

raise the images described by the docker-compse.yml file
```
docker-compose up -d
```

# C

**ready the db**
1. enter the shell of our postgres container
```
docker-compose run postgres bash
```
2. run psql (password: docker)
```
psql -h database -p 5432 -U docker postgres
```
3. create a privileged user for our *new tricktionary database
```
CREATE user storysquad with encrypted password 'llama';
CREATE database tricktionary;
GRANT all privileges on database tricktionary to storysquad;
\q
 ```
4. exit the shell
```
exit
```
#
**knex**

5. install
```
npm install -g knex
```
6. migrate
```
npx knex migrate:latest
```
7. seed
```
npx knex seed:run
```
# D

to stop the postgres container,
```
docker-compose down --remove-orphans
```
#
*follow [step B](#B) to start the postgres container again.
# 
*if/when your '/tmp/postgres.conf' disappears, 
re-run [step A](#A)
#
***docker-compose*** reads the [docker-compose.yml](docker-compose.yml) and will require an additional option when run from another folder

```
docker-compose -f docker/docker-compose.yml COMMAND
```