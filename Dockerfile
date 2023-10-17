# Use the official Node.js image with Alpine Linux as the base
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies without copying the entire node_modules directory
RUN npm install

# Copy the rest of your application code to the container
COPY . .

EXPOSE $PORT

CMD ["node", "index.js"]