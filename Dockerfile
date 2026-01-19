FROM node:20-alpine

WORKDIR /app

# Instala dependencias primero (mejor cache)
COPY package*.json ./
RUN npm install

# Copia el resto
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
