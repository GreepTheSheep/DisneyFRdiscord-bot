FROM node:lts

WORKDIR /server/disneyfrbot

COPY ./src /server/disneyfrbot/src
COPY ./assets /server/disneyfrbot/assets
COPY ./.env /server/disneyfrbot/.env
COPY ./package.json /server/disneyfrbot/package.json
COPY ./.git /server/disneyfrbot/.git

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm i --production

CMD node /server/disneyfrbot/src/bot.js