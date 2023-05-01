FROM node:alpine
WORKDIR /srv/app
COPY package*.json ./
COPY . .
RUN npm install --loglevel verbose