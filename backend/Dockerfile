FROM python:3.9.4-slim

LABEL MAINTAINER="CosmicOppai"
LABEL Description="Highly Scalable URL Shortener written using FASTAPI, REACT and Cassandra"

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY chi_url backend/chi_url

COPY logs backend/logs

WORKDIR backend/chi_url

ENV DB_USERNAME=${DB_USERNAME} \
    DB_PASSWORD=${DB_PASSWORD} \
    KEYSPACE=${KEYSPACE} \
    SECRET_KEY=${SECRET_KEY} \
    ALGORITHM=${ALGORITHM} \
    EMAIL=${EMAIL} \
    EMAIL_PASSWORD=${EMAIL_PASSWORD} \
    ORIGIN=${ORIGIN} \

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port", "8000"]