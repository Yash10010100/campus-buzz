FROM node:20-alpine AS base
WORKDIR /usr/src/api
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN npm install --production
COPY . .
EXPOSE 3005
CMD ["npm", "run", "start"]