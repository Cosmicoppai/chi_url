FROM node:16.8.0-slim

WORKDIR /frontend

COPY package.json ./

RUN npm install

COPY . ./

RUN npm run build