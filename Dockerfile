# back/Dockerfile

FROM node:24.11.1-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:24.11.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
