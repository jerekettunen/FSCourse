FROM node:20

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Ensure the node_modules folder is owned by the node user
RUN chown -R node:node /usr/src/app/node_modules

# Copy the rest of the application code
COPY --chown=node:node . .

USER node

# Start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]