FROM node:18-alpine AS build
WORKDIR /usr/src/app/
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app/
COPY package.json .
RUN npm install
COPY --from=build /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000

ENTRYPOINT [ "node", "dist/main.js" ]
