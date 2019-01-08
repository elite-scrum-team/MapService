FROM node:10.10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production -no-audit

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
