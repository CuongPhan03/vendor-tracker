### BUILD ###
FROM node:22-alpine AS build

# Enable pnpm via corepack
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm exec prisma generate

RUN pnpm run build

RUN pnpm prune --prod

### PRODUCTION ###
FROM node:22-alpine AS production

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Required for Prisma migrations
COPY --from=build /app/prisma ./prisma

CMD ["pnpm", "start:docker"]