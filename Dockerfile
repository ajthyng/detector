FROM node:lts-alpine3.17
WORKDIR /app

COPY ./src ./src
COPY ./prisma ./prisma
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
COPY ./nest-cli.json ./
COPY ./.env ./

RUN npm i
RUN npm run build

CMD ["node", "dist/main.js"]
