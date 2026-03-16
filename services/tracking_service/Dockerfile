FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY services/tracking_service/ .
COPY shared ./shared

EXPOSE 4003

CMD ["node", "index.js"]