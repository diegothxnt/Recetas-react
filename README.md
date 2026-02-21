#  Recetario Digital

Aplicación web para gestionar recetas de cocina desarrollada con React.

##  Características

-  **Autenticación** - Login con credenciales
-  **CRUD completo** - Crear, leer, actualizar y eliminar recetas
-  **4 versiones** de tarjetas de recetas adaptables
-  **Crop automático** de texto e imágenes
-  **Popup** para ver recetas completas
-  **Persistencia** con localStorage

##  Instalación y Ejecución PASO A PASO

### Requisitos previos
- Node.js (v14 o superior) - Descargar de https://nodejs.org
- npm (viene con Node.js)
  

###  Pasos para compilar (IMPORTANTE: seguir en orden)

```bash
# PASO 1: Abrir terminal en la carpeta del proyecto
cd ruta/del/proyecto/recetario-digital

# PASO 2: Inicializar npm (crea package.json)
npm init -y

# PASO 3: Instalar React y dependencias básicas
npm install react react-dom react-scripts

# PASO 4: Crear/verificar estructura de carpetas
# Asegúrate de tener:
#   - src/ (con todos tus componentes)
#   - public/ (con index.html)

# PASO 5: Reemplazar package.json (copiar el contenido de abajo)
# Abre package.json y reemplaza TODO con esto:

{
  "name": "recetario-digital",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}


# PASO 6: Instalar todas las dependencias (esto crea node_modules)
npm install

# PASO 7: Iniciar la aplicación
npm start

```


## Autor
Nombre: Diego Rojas 

Materia: Manejo de Frameworks

Tecnología: React







