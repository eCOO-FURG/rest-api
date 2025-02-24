FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache chromium openssl

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD ["pnpm", "run", "start"]
