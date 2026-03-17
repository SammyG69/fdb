FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY services/meal_service/ .
COPY shared ./shared

EXPOSE 4002

CMD ["node", "index.js"]