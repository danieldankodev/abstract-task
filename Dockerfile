FROM node:18-alpine

USER node

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

CMD [ "node", "dist/main.js" ]
