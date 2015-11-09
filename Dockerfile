FROM node:latest

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src
ADD . /src
RUN npm install -g bower
RUN npm install -g mocha
RUN npm install
RUN bower install --allow-root


EXPOSE 1337
EXPOSE 8080

CMD npm start