FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY services/user_service/ .
COPY shared ./shared

EXPOSE 4001

CMD ["node", "index.js"]