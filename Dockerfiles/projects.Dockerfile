FROM node:18-alpine

RUN mkdir -p /usr/src/

WORKDIR /usr/src/

COPY projects/ /usr/src/

RUN npm ci
RUN npm run build
CMD ["npm", "start"]
