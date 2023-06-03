FROM node:12.18.3-alpine3.12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 8080
EXPOSE 8080

# Run app
CMD ["npm", "start"]