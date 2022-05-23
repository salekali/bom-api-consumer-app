# base image
FROM --platform=linux/amd64 node:18-alpine3.14

RUN mkdir /app
ADD . /app

WORKDIR /app
RUN npm install
CMD node index.js --bind 0.0.0.0:$PORT