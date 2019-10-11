FROM node:12-alpine
COPY ./app /
ENV GRPC_TRACE all
ENV GRPC_VERBOSITY debug
RUN mkdir /secrets
CMD ["./start.sh"]
