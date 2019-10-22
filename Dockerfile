# build stage base image
FROM node:11.14 as build

WORKDIR  /app

# copy only package(lock).json to cache efficently layer with node_modules
COPY package*.json ./
RUN npm install

COPY . ./

# build application in $configuration mode
ARG configuration=production
RUN npm run build -- --output-path=./dist/out --configuration $configuration

# runtime stage base image
FROM nginx:1.16 as runtime

# copy built app to nginx hosting folder
COPY --from=build /app/dist/out/ /usr/share/nginx/html

# copy nginx config for SPA
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
