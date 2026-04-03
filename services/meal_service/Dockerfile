FROM node:20-alpine

RUN addgroup -S mealservice1406 && adduser -S mealservice1406 -G mealservice1406

WORKDIR /home/mealservice1406/app

COPY package*.json ./
RUN npm install

COPY . .

USER mealservice1406

COPY services/meal_service/ .
COPY shared ./shared

EXPOSE 4002

CMD ["node", "index.js"]