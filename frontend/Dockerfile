FROM node:16.8.0-slim

WORKDIR /frontend

COPY package.json ./

RUN npm config set registry https://registry.npmjs.com/

RUN npm config set proxy http://backend:8000/

RUN npm config set https-proxy http://backend:8000

RUN npm install

COPY . ./

RUN npm run build