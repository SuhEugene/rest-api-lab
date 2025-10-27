FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY *.js /app/
COPY pages /app/pages
COPY vids /app/vids

VOLUME videos.db

RUN node seed.js

CMD ["node", "index.js"]