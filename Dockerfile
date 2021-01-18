FROM node:12

# Create app directory
WORKDIR /opt/app

# COPY build .
COPY release/current.zip .
RUN unzip current.zip
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# expose the api
EXPOSE 5000


CMD ["node", "src/index.js"]
