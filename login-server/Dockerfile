FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=root
ENV SK=secret

CMD ["node", "server.js"]