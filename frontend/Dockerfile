FROM ubuntu:22.04

RUN apt-get update && apt-get install -y curl npm

WORKDIR /app

RUN npm install -g n
RUN n install v18

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
