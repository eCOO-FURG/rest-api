# 🌐 eCOO API

Built based on Clean Architecture & Domain-Driven Design principles.

### 📚 Library

- Express
- Typescript
- Awilix
- Prisma
- Zod

### 🚀 How To Use

1. Clone repository:

```bash
  git clone git@github.com:eCOO-FURG/rest-api.git && cd rest-api
```

2. Create your own .env copying env.example.

3. Ensure you have [pnpm](https://pnpm.io/pt/) installed and run pnpm install.

4. Run using docker-compose:

```bash
  pnpm run dev
```

4. Run the seeds:

```bash
  npx prisma migrate dev && npx prisma db seed
```

### 🧪 Testing

Check all unit tests:

```bash
  npm run test
```

### 📌 Notes

A SMTP server will be created on [local network](http://localhost:3010/). It shall retrieve all application sent emails when on development environment.

It is recommend usign prisma studio. It can be initialized using:

```bash
  npx prisma studio
```
