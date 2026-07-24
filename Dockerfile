FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache chromium openssl tzdata

ENV TZ=America/Sao_Paulo

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN npx prisma generate

ARG GIT_COMMIT=unknown
ENV GIT_COMMIT=$GIT_COMMIT

EXPOSE 3333

CMD ["pnpm", "run", "start"]
