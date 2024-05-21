FROM node:22-alpine

WORKDIR /app
COPY src src
COPY package.json package.json
RUN npm install
CMD ["node", "src/index.js"]
EXPOSE 8888
VOLUME [ "/app/in" ]
VOLUME [ "/app/out" ]