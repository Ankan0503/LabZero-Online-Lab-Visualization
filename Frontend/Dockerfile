FROM node:18-alpine

WORKDIR /app

COPY package.json ./

# Attempt to copy package-lock.json if it exists
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
