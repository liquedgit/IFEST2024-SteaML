FROM node:18-alpine

COPY package* .

RUN npm i

COPY . .

RUN npm run build