FROM node:alpine

USER node

ENV APP_ENV production

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node ./ ./

# run tests

RUN npm run build

CMD [ "npm", "run", "start:prod" ]