FROM node:10.21.0 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:1.15-alpine
RUN mkdir /app
COPY --from=builder /app/dist /app
RUN apk add jq=1.6-r0
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/app_nginx.template /etc/nginx/app_nginx.template
COPY docker/entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
