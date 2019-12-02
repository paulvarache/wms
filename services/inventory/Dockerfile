FROM node:12-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
RUN yarn

COPY src ./src
RUN yarn build

FROM node:12-alpine  AS service
COPY --from=builder --chown=node:node /usr/src/app/lib /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder --chown=node:node /usr/src/app/node_modules /usr/src/app/node_modules
USER node
WORKDIR /usr/src/app

EXPOSE 3000

CMD ["node", "."]