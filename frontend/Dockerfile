FROM node:16.8.0-slim AS frontend

WORKDIR /frontend

COPY package.json ./

EXPOSE 3000

RUN  npm config set registry https://registry.npmjs.com/

RUN npm install

COPY . ./

RUN npm run build

CMD ["npm", "start"]