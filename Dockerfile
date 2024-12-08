FROM node:20-bullseye

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 3001

CMD ["yarn", "start:dev"]
