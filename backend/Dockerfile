FROM node:22.12.0-alpine3.20 AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npm run prisma:generate
COPY . .
RUN npm run build

FROM node:22.12.0-alpine3.20
WORKDIR /app

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/index.js" ]