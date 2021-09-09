FROM node:16.8.0-slim AS frontend

WORKDIR /frontend

COPY package.json ./

EXPOSE 3000

RUN  npm config set registry https://registry.npmjs.com/

RUN npm install

COPY . ./

RUN npm run build

FROM nginx:1.21-alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend /frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]