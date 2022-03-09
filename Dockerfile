FROM node:16.13.0
# create app directory
WORKDIR /usr/src/app
# bundle app source
COPY . .
RUN npm install 
CMD ["npm", "run", "start:dev"]

EXPOSE 3000