FROM node:22

WORKDIR /app

COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/

RUN cd apps/web && npm install

COPY apps/web ./apps/web

WORKDIR /app/apps/web

CMD ["npm", "run", "dev"]
