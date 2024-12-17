FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

RUN apk add chromium

RUN apk add openssl

COPY . ./

RUN npx prisma generate

EXPOSE 3333

CMD ["pnpm", "run", "start"]
