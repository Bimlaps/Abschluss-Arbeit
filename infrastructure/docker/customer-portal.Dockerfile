FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/customer-portal/package.json ./apps/customer-portal/

RUN yarn install

COPY apps/customer-portal ./apps/customer-portal

EXPOSE 3000

CMD ["yarn", "workspace", "@247vitrine/customer-portal", "dev"]
