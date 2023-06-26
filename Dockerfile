FROM node:15.8.0

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "install"]
