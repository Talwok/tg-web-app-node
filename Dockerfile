FROM node:latest

WORKDIR /tg-web-app-node

EXPOSE 8000

COPY package*.json ./

RUN npm install 

COPY . .

CMD ["npm", "run", "start"]