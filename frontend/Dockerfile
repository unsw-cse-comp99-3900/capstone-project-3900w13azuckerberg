# version of node to use
FROM node:14

# this is the working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json to the working directory (required to install dependencies)
COPY package*.json ./

# command that is run to install dependencies
RUN npm install

# expose port 3001 to the outside world (required to access the app at port 3001 however, we map this internal 3001 to an external port in the docker-compose file)
EXPOSE 3001

# command that is run to start the app (can be overriden in the docker-compose file)
CMD ["npm", "start"]