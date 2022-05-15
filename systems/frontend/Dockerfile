# Builder Stage
FROM node:gallium-alpine AS builder

WORKDIR /usr/src/demo

COPY ./ .

RUN npm ci --ignore-scripts && \
    npm run build

# Run stage
FROM nginx:stable-alpine

COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /usr/src/demo/dist/frontend /usr/share/nginx/html
