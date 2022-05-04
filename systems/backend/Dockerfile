# Builder Stage
FROM node:gallium-alpine AS builder

WORKDIR /usr/src/demo

COPY ./ .

RUN npm ci --ignore-scripts && \
    npm run build

# Run stage
FROM node:gallium-alpine

WORKDIR /usr/src/demo

RUN apk add dumb-init

COPY --from=builder /usr/src/demo/ ./

USER node