FROM node:latest

WORKDIR /home/node/workspace
RUN apt-get update
RUN apt-get install git vim -y

RUN chown -R node:node /home/node/workspace
USER node

CMD ["yarn", "start"]