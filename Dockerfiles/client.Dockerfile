FROM node:16-alpine

RUN mkdir -p /usr/src/service
RUN mkdir -p /usr/src/service/src

WORKDIR /usr/src/

COPY client/ /usr/src/

RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]

