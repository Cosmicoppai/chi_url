FROM python:3.9.4-slim

LABEL MAINTAINER="CosmicOppai"
LABEL Description="Highly Scalable URL Shortener written using FASTAPI, REACT and Cassandra"

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY chi_url backend/chi_url

COPY logs backend/logs

WORKDIR backend/chi_url

ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV KEYSPACE=${KEYSPACE}
ENV SECRET_KEY=${SECRET_KEY}
ENV ALGORITHM=${ALGORITHM}
ENV EMAIL=${EMAIL}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}
ENV ORIGIN=${ORIGIN}
ENV ORIGIN2=${ORIGIN2}

EXPOSE 8000

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind","0.0.0.0:8000"]