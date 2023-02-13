FROM node:14.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm cache clean --force

COPY . .

RUN npm run build
