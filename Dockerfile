FROM node:14

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG MODE_ENV
ENV MODE=$MODE_ENV

# Installing dependencies
COPY package*.json .

RUN npm install

# Copying source files
COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 5000
ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]
