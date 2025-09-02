# profitsarts.com
Profitsarts portfolio on Jekyll

# Profits Jekyll Portfolio

## Requisitos
- Node.js 12.22.12 (usa nvm)
- Ruby (para Jekyll)

## Instalación y Ejecución

### Primera vez:
1. Cambiar a la versión correcta de Node
nvm use 12.22.12
2. Instalar dependencias Node
npm install
3. Instalar dependencias Ruby
bundle install
4. Ejecutar el proyecto
npm run start

### Ejecuciones siguientes:

Si tienes auto-switch configurado, solo ejecuta:
npm run start
Si no tienes auto-switch, primero:
nvm use
npm run start
text

## Notas Importantes
- Este proyecto REQUIERE Node 12.22.12 debido a Gulp 3
- NO actualizar a Gulp 4 - romperá el build
- Si tienes errores de "primordials", verifica que usas Node 12
