FROM node:20-alpine

RUN addgroup -S gateway1406 && adduser -S gateway1406 -G gateway1406

WORKDIR /home/gateway1406/app

COPY package*.json ./
RUN npm install

COPY . .

USER gateway1406

EXPOSE 3000

CMD ["node", "index.js"]