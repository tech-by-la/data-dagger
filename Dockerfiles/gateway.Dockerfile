FROM node:16-alpine

RUN mkdir -p /usr/src/

WORKDIR /usr/src/

COPY gateway/ /usr/src/

RUN npm install
RUN npm run build
CMD ["npm", "start"]

