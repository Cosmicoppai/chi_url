FROM node:16.8.0-slim AS frontend

WORKDIR /frontend

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE 3000

RUN npm run build

FROM nginx

COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=frontend /frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]