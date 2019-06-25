FROM node:10-slim AS builder

WORKDIR /app
COPY package*.json ./

RUN npm install

RUN npm install typescript tslint -g 

COPY . .
RUN npm run build --prod

FROM node:10-slim

WORKDIR /app
EXPOSE 8080
COPY --from=builder /app . 
RUN npm install
ENTRYPOINT [ "npm", "run", "start-prod" ]
