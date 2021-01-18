![dockerize](dockerize.gif)

# Tricktionary Docker-ware

I get bored, I containerize API.

If you don't use Docker, you can totally ignore this.


**Requirements**

- Docker
- docker-compose


**.env**

    PORT=5000
    DATABASE_URL=postgresql://storysquad:llama@0.0.0.0:5432/tricktionary
    BASE_URL=http://0.0.0.0

#
**Instructions** :


1. **install dependencies**

        npm install


2. **build this container**
   
   *for detail, see package.json scripts

        npm run-script dockerize


# 

3. **postgresql setup**

   *for detail, see docker-compose.yml volumes

        mkdir pgdata
        touch postgres.conf

4. **raise the docker images**
    
        docker-compose up -d

5. **grab a PostgreSQL configuration file for persisting the db settings.**

   *for detail, see docker-compose.yml volumes

        docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > postgres.conf

6. **restart the images**

        docker-compose restart

7. **login to psql & ready the db (password=docker)**

        psql -h localhost -p 5432 -U docker postgres


      postgres=#

        CREATE user storysquad with encrypted password 'llama';
        CREATE database tricktionary;
        GRANT all privileges on database tricktionary to storysquad;
        \q
#

8. **migrate the db tables**

        docker-compose run api npx knex migrate:latest

9. **run seed files**

        docker-compose run api npx knex seed:run 

#

**Success**

http://localhost:5000/api/words 


***frontend development,***

.env 

    REACT_APP_API_URL=http://localhost:5000
#

**troubleshooting**

fine-tune your docker-compose.yml

if, for example, you have another server running on port 5432 (postgres), 

- simply find the offending port "5432:5432" and ask it to publish elsewhere "5400:5432". 
- In the case of Postgres, you may need to update DATABASE_URL in the .env file
- Finally, restart the process at step 1. The newly created image will include any changes you made to the .env file.

**removing**

    docker-compose down
    docker image prune -a
    rm postgref.conf
    sudo rm -rf pgdata

