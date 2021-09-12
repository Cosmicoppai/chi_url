FROM node:16.8.0-slim

WORKDIR /frontend

COPY package.json ./

RUN npm config set registry https://registry.npmjs.com/

RUN npm install

COPY . ./

RUN npm run build