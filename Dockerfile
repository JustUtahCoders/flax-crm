FROM node:16.4.2
ENV NODE_ENV=production
ENV PORT=8080
RUN npm install -g pnpm
RUN mkdir /app
WORKDIR /app
COPY lib .
COPY package.json .
COPY backend/DB backend/DB
RUN pnpm install --production
ENTRYPOINT pnpm start