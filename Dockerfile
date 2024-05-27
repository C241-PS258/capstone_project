FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN yarn

COPY . .

COPY ./entrypoint.sh /entrypoint.sh

RUN sed -i 's/\r//' /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]