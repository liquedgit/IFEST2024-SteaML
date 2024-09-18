FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package* .
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN chmod +x startup.sh

EXPOSE 3000

CMD ["npm", "run", "start"]
