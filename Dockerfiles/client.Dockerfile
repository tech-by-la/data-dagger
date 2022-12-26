FROM node:18-slim

RUN mkdir -p /usr/src/

WORKDIR /usr/src/

COPY client/ /usr/src/

RUN npm ci
RUN npm run build:prod
RUN npx playwright install-deps
CMD ["npm", "start"]

