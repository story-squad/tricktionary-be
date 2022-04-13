## Word Hoax backend
- Express App
- uses socket.io
- currently does not use long pooling

### Migration
These Env vars may need assigned:
- App Basics
  - BASE_URL
  - PORT 

- Database Vars
  - DATABASE_URL
  - DB_ENVIRONMENT

- Game Vars
  - MAX_PLAYERS
  - USERNAME_CHARACTER_LIMIT

- REDIS_HOST
- LOGFILE
- LOGFOLDER 
- OKTA_URL_ISSUER
- OKTA_CLIENT_ID
- LC_LENGTH
- CLEVER_BASE_URL
- DEFAULT_TTL
- JWT_SECRET
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY 
- SCOOP_SIZE
