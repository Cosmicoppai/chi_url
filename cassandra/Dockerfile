FROM cassandra:4.0

ENV LANG C.UTF-8

COPY *.cql /docker-entrypoint-initdb.d/

COPY entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]

CMD ["cassandra", "-f"]
