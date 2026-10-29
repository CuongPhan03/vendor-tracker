FROM node:22-alpine

# Enable pnpm via corepack
RUN corepack enable

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN pnpm i

COPY . .

EXPOSE 5173

CMD ["pnpm", "dev"]