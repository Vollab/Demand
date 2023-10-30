FROM node:lts-alpine

WORKDIR /app

COPY package.json .
COPY demand/package.json demand/
COPY common/package.json common/

# prod
# RUN npm i --only=prod -w demand -w common

# dev
RUN npm i -w demand -w common

COPY demand demand
COPY common common

CMD npm start -w demand