sudo docker-compose stop

sudo docker volume rm chi_url_react_build

sudo docker-compose up --build --force-recreate frontend nginx