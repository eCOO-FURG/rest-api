FROM node:20.10.0

WORKDIR /app

COPY package.json pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD ["pnpm", "run", "start"]
