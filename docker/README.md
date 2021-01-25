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
   
   *for detail, see [package.json](../package.json) scripts

        npm run-script dockerize


# 

3. **postgresql setup**

   *for detail, see docker-compose.yml volumes

        mkdir pgdata
        touch postgres.conf

4. **raise the docker images**
    
        docker-compose up -d postgres

5. **grab a PostgreSQL configuration file for persisting the db settings.**

   *for detail, see docker-compose.yml volumes

        docker run -i --rm postgres cat /usr/share/postgresql/postgresql.conf.sample > postgres.conf

6. **restart the images**

        docker-compose restart postgres api

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

http://localhost:5000/api/reactions


***frontend development,***

.env 

    REACT_APP_API_URL=http://localhost:5000
#

10. **build the frontend**

- Find the service named "web", described in the [docker-compose.yml](../docker-compose.yml).
- Find "volumes", within that service.
        
        - ../tricktionary-fe/build:/usr/share/nginx/html
- understand that it maps a:b; where a is your local machine and b is the container housing the service named "web".

      - ../tricktionary-fe/build:/usr/share/nginx/html

- the web service will serve data from an adjacent folder named "tricktionary-fe"; providing it contains a folder named "build" that includes a file named index.html.

         ..
         tricktionary-be/
           docker-compose.yml
         tricktionary-fe/
           build/

- *clone the frontend adjacent to this project and run the provided build script.

11. **rebuilding with** [./makeLocal.sh](../makeLocal.sh) 

- this script will automate the rebuild process and should work in most POSIX-compliant, BASH-friendly environments. 
- ****steps 1 - 10 must to be completed first.***
- ****create the local-env file prior to use.***
        
        cp .env .local-env

- if you should find it necessary, you can safely alter the local environment variables within ***.local-env*** (this file is not used in production)


12. **building for deployment with** [./makeAWS.sh](../makeAWS.sh) 

- While almost identical to the rebuild script, this script will use the original .env file and a modified production-ready [Dockerfile](Dockerfile.production)


**troubleshooting**

fine-tune your docker-compose.yml

if, for example, you have another server running on port 5432 (postgres), 

- simply find the offending port "5432:5432" and ask it to publish elsewhere "5400:5432". 
- In the case of Postgres, you may need to update DATABASE_URL in the .env file
- Finally, restart the process at step 1. The newly created image will include any changes you made to the .env file.

**removing**

    docker-compose down
    docker image prune -a
    rm postgres.conf
    sudo rm -rf pgdata
#
