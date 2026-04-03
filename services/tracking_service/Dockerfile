FROM node:20-alpine

RUN addgroup -S trackingservice1406 && adduser -S trackingservice1406 -G trackingservice1406

WORKDIR /home/trackingservice1406/app

COPY services/tracking_service/package*.json ./
RUN npm install

COPY services/tracking_service/ .
COPY shared ./shared

USER trackingservice1406

EXPOSE 4003
CMD ["node", "index.js"]