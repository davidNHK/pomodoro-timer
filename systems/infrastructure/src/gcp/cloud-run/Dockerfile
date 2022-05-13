FROM node:lts-alpine

ARG WORKING_DIR="/system"

RUN mkdir -p ${WORKING_DIR}

WORKDIR ${WORKING_DIR}

COPY sample-api.mjs ${WORKING_DIR}

EXPOSE 5000

CMD ["node", "sample-api.mjs"]