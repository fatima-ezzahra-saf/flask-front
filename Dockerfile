ARG version=latest

FROM node:${version}

WORKDIR /app

copy package*.json ./

copy . .

run npm install

expose 3000

CMD [ "npm" , "start"]
