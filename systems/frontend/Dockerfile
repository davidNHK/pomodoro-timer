# Builder Stage
FROM node:gallium-alpine AS builder

WORKDIR /usr/src/demo

COPY ./ .

RUN npm ci --ignore-scripts && \
    npm run build

# Run stage
FROM nginx:stable

COPY --from=builder /usr/src/demo/dist/frontend /usr/share/nginx/html
