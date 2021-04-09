FROM node:lts-alpine

WORKDIR /app

# Packages
COPY ./ts*.json ./
COPY ./package*.json ./
RUN npm install

# Folders
COPY ./public ./public
COPY src ./src

# Envs
ENV NODE_PATH ./src
ENV DEBUG abernode-server

# Port to expose
EXPOSE 3000

CMD ["npm", "start"]
