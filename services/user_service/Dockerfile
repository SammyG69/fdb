FROM node:20-alpine

RUN addgroup -S userservice1406 && adduser -S userservice1406 -G userservice1406

WORKDIR /home/userservice1406/app

COPY package*.json ./
RUN npm install

COPY . .

COPY services/user_service/ .
COPY shared ./shared

USER userservice1406

EXPOSE 4001

CMD ["node", "index.js"]