FROM node:20-alpine

WORKDIR /app

COPY services/tracking_service/package*.json ./
RUN npm install

COPY services/tracking_service/ .
COPY shared ./shared

EXPOSE 4003
CMD ["node", "index.js"]