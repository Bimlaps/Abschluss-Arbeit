FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY services/auth-service/package.json ./services/auth-service/
COPY packages/config/package.json ./packages/config/
COPY packages/types/package.json ./packages/types/

RUN yarn install

COPY tsconfig.json ./
COPY services/auth-service ./services/auth-service
COPY packages/config ./packages/config
COPY packages/types ./packages/types

RUN yarn workspace @247vitrine/config build
RUN yarn workspace @247vitrine/types build
RUN yarn workspace @247vitrine/auth-service build

EXPOSE 3001

CMD ["yarn", "workspace", "@247vitrine/auth-service", "dev"]
