FROM node:18-alpine

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar solo los archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias de producción y desarrollo explícitamente
RUN npm install --production=false

# Copiar el código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# Verificar la compilación
RUN ls -la dist || echo "¡Error! No se encuentra el directorio dist"

# Puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/index.js"]