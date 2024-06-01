FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm install serve -g

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist"]