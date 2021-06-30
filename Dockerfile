#
# build stage
#
FROM node:14-alpine AS build
WORKDIR /app
# install all dependencies
COPY ./ /app
RUN npm install
# build the application
RUN npm run build

#
# final stage
#
FROM nginx:alpine
# delete all nginx default data
RUN rm -rf /usr/share/nginx/html/*
# copy data from the previous stage
COPY --from=build /app/build /usr/share/nginx/html/
