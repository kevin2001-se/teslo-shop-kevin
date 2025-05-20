# Descripcion

## Correr en dev

1. Clonar el directorio
2. Crear una copia del ```env.template``` y  renombralo a ```env``` y cambiar las variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prima migrate dev```
6. Ejecutar seed ```npn run seed```
7. Correr el proyecto ```npm run dev```