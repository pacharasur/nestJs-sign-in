FROM node:20-bullseye

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn add --platform=linux --arch=arm64v8 sharp

EXPOSE 3001

CMD ["yarn", "start:dev"]
