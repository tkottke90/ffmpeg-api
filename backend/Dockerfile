FROM node:18 AS build_stage

WORKDIR /usr/build/

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

WORKDIR /usr/app/

RUN apt-get update && apt-get upgrade -y
RUN apt-get install ffmpeg -y

COPY --from=build_stage /usr/build/dist /usr/app
COPY package*.json ./

RUN npm ci

CMD [ "node", "index.js"]

ENV PORT 3000
ENV NODE_ENV production

EXPOSE 3000