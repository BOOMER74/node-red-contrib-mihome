FROM node:12

RUN npm i -g node-red

WORKDIR /home/node/node-red-contrib-mihome
COPY package.json .
RUN npm ln

USER node

WORKDIR /home/node
RUN mkdir .node-red

WORKDIR /home/node/.node-red
RUN npm ln node-red-contrib-mihome

CMD node-red
