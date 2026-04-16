FROM oven/bun:1.2

WORKDIR /app

COPY apps/api/package.json apps/api/bun.lock* ./apps/api/
COPY packages/db/package.json ./packages/db/

RUN cd apps/api && bun install

COPY apps/api ./apps/api
COPY packages/db ./packages/db

WORKDIR /app/apps/api

CMD ["bun", "run", "--hot", "src/index.ts"]
