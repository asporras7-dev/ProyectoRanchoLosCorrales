# Sistema de Reservas - Rancho Los Corrales

Sistema fullstack para la gestión integral de reservas de la corporación Rancho Los Corrales.
Contiene página pública con formularios desplegables para que los clientes puedan insertar sus datos y los de la reserva, y luego proceder a enviarla.
Las reservas pueden ser enviadas para el alquiler del rancho de la corporación o para adquirir un servicio de parrillada a domicilio.
También contiene una sección de login y recuperación de contraseña, lo que introduce a un panel de administración privado 
para la aprobación o rechazo de las reservas que realizan los clientes, bloqueo automático y manual de fechas disponibles
y para la administración de los usuarios que tienen acceso a el panel de administración privado.

## Stack Tecnológico

El proyecto está construido bajo una arquitectura cliente-servidor (Full-Stack), separando la lógica de negocio de la interfaz de usuario para garantizar escalabilidad, seguridad y mantenibilidad.

### Frontend (SPA)
- **Tecnologías Base**: 
  - **HTML5**: Estructuración semántica para mejorar la accesibilidad y el SEO.
  - **CSS3**: Estilos avanzados, Flexbox/Grid y animaciones nativas.
  - **JavaScript (ES6+)**: Lógica del lado del cliente, asincronía (Promises/Async-Await) y manipulación del DOM.
- **Framework & Build Tools**:
  - **React.js (v18)**: Construcción de interfaces de usuario interactivas y modulares basadas en componentes funcionales y Hooks.
  - **Vite**: Herramienta de construcción (bundler) ultra rápida para el entorno de desarrollo y optimización del bundle en producción.
  - **React Router DOM v7**: Gestión de enrutamiento del lado del cliente para una experiencia fluida de Single Page Application.
- **Diseño y UI**:
  - **Bootstrap 5 + CSS Vanilla**: Diseño responsivo y mobile-first que combina el sistema de cuadrículas de Bootstrap con estilos personalizados.
  - **SweetAlert2**: Gestión de modales y alertas interactivas personalizadas.
- **Librerías Adicionales**: 
  - *Leaflet / React Leaflet*: Integración de mapas interactivos para selección de ubicaciones.
  - *Nominatim API (OpenStreetMap)*: Servicio de geocodificación inversa para autocompletar direcciones basadas en coordenadas geográficas.
  - *Swiper & GLightbox*: Galerías y carruseles táctiles de alto rendimiento.
  - *SheetJS (xlsx)*: Procesamiento y exportación de reportes tabulares (Excel) directamente desde el navegador.

### Backend (API REST)
- **Node.js & Express.js**: Creación de una API RESTful robusta, manejando rutas modulares y middlewares personalizados.
- **Sequelize (ORM)**: Gestión de la base de datos relacional mediante modelos orientados a objetos, facilitando consultas complejas y sanitización de datos.
- **MySQL**: Motor de base de datos relacional para garantizar la integridad, relaciones (Constraints) y persistencia de los datos del negocio.
- **Autenticación & Seguridad**: 
  - *JSON Web Tokens (JWT)*: Manejo de sesiones sin estado (stateless) para proteger los endpoints de la API y gestionar la recuperación de contraseñas.
  - *Bcrypt.js*: Encriptación segura (Hashing) de contraseñas de un solo sentido.
  - *CORS & Cookie Parser*: Control de políticas de acceso cruzado y manejo seguro de cookies httpOnly.

### Integraciones y Servicios Cloud
- **Cloudinary (Direct-to-Cloud)**: Arquitectura optimizada donde el frontend envía imágenes directamente a la API de Cloudinary vía `FormData`, reduciendo drásticamente la carga de red del backend. Utilizado para almacenamiento y entrega optimizada (CDN) de imágenes.
- **Nodemailer**: Integración SMTP para el envío automático de correos electrónicos transaccionales (confirmaciones de reserva, tokens de recuperación).
- **cPanel / Passenger**: Despliegue en producción gestionando de forma independiente los entornos: un servidor Node.js (Passenger) para la API y la entrega de archivos estáticos transpilados para el Frontend.

---

## Funcionalidades Principales

El sistema es una solución integral ("End-to-End") que digitaliza tanto la experiencia del cliente como la operación interna del negocio. Se divide en dos grandes módulos:

### 1. Portal Público (Experiencia del Cliente)
- **Identidad Corporativa e Información (Landing Page)**:
  - **Historia y Valores**: Sección dedicada a transmitir la esencia, trayectoria y visión de "Rancho Los Corrales", conectando con el cliente de manera visual.
  - **Servicios Generales**: Presentación atractiva de la oferta del negocio (Parrilladas a domicilio, Eventos privados, Catering, etc.) con llamados a la acción (CTAs) claros.
  - **Contacto y Ubicación**: Integración de formulario directo de contacto, enlaces a redes sociales y un mapa interactivo (Leaflet) con la ubicación exacta de las instalaciones.
- **Catálogos Dinámicos**: Visualización en tiempo real de los menús (categorizados), servicios adicionales y opciones de decoraciones temáticas. Todo el contenido es administrable desde el backend y se actualiza instantáneamente.
- **Motor de Reservas Dual**:
  - **Reservas en el Rancho**: Flujo paso a paso para eventos físicos, permitiendo al cliente seleccionar fecha, hora, cantidad de asistentes, elegir su menú preferido y agregar extras (decoraciones, servicios adicionales).
  - **Reservas a Domicilio**: Flujo especializado para eventos externos (catering), adaptando la oferta de "Menús a domicilio" y utilizando geocodificación inversa (Nominatim API) para autocompletar la dirección exacta basada en el pin del mapa.
- **Galería Interactiva**: Visualización de instalaciones y eventos pasados mediante carruseles (Swiper), optimizada para carga rápida y responsividad (Mobile-First).
- **Experiencia de Usuario (UX) Mejorada**: Reemplazo de las alertas nativas del navegador por **SweetAlert2**, proporcionando retroalimentación visual amigable, asíncrona y no intrusiva ante acciones críticas (confirmaciones de reserva, errores de validación, éxito).

### 2. Panel de Administración (Gestión Operativa)
- **Seguridad y Accesos (Autenticación)**:
  - Sistema de Login seguro protegido por **JWT (JSON Web Tokens)** guardado en cookies httpOnly y encriptación de contraseñas.
  - **Recuperación de Contraseña (Forgot Password)**: Flujo seguro automatizado con el envío de tokens JWT temporales (vía Nodemailer) y restablecimiento de credenciales con Bcrypt.js.
  - **Gestión de Usuarios y Roles**: Creación, edición y suspensión de cuentas para empleados administrativos, controlando los permisos de acceso al dashboard.
- **Gestión Avanzada de Reservas (CRUD & Filtros)**:
  - Tablero centralizado donde los administradores pueden ver todas las reservas entrantes (Rancho y Domicilio).
  - **Filtros Dinámicos**: Búsqueda cruzada de reservas por rango de fechas (Fecha Inicio - Fecha Fin) y por estados del ciclo de vida (`Pendiente`, `Aprobada`, `Cancelada`).
  - **Gestión de Estados**: Capacidad de aprobar o rechazar reservas con notificaciones automáticas al cliente.
- **Exportación de Datos (Reportes)**: Generación y descarga de archivos de Excel (`.xlsx`) basados estrictamente en los datos filtrados en pantalla. Ideal para contabilidad, logística de cocina y reportes gerenciales.
- **Bloqueo Inteligente de Fechas**:
  - Módulo independiente para bloquear días en la agenda (por remodelaciones, festivos, o aforo completo).
  - Separación lógica: Capacidad de bloquear fechas de manera independiente para "Eventos en el Rancho" o "Eventos a Domicilio", garantizando flexibilidad operativa.
- **Gestión de Inventario y Oferta**:
  - Administración completa (Crear, Leer, Actualizar, Eliminar) de **Menús** (con sus respectivas categorías), **Servicios Adicionales** y **Decoraciones Temáticas**.
  - Subida directa de imágenes representativas para cada producto a través de la integración con **Cloudinary**.
- **Administración de la Galería**: Módulo para subir, previsualizar y eliminar imágenes promocionales que se reflejan automáticamente en el portal público.
- **Notificaciones Automáticas**: Integración de envíos de correo electrónico (Nodemailer) para mantener al cliente informado sobre la confirmación, aprobación o cancelación de su evento.

---

## Valor de Negocio y Logros Técnicos

Este proyecto no es solo una página web; es un SaaS (Software as a Service) a medida que resuelve un problema operativo logístico del mundo real, demostrando habilidades avanzadas de arquitectura de software:

- **Optimización Direct-to-Cloud**: El sistema está diseñado para que el navegador suba las imágenes directamente a **Cloudinary** usando `FormData`. Esta decisión arquitectónica evita triangular archivos binarios pesados a través del backend en Node.js, ahorrando drásticamente CPU y ancho de banda del servidor.
- **Integración de APIs Geográficas**: Uso inteligente de **Leaflet** y geocodificación inversa con **Nominatim API** (OpenStreetMap). El mapa interactivo traduce las coordenadas de un "pin" arrastrado por el usuario directamente en una dirección física exacta, optimizando la logística de entregas a domicilio.
- **Procesamiento de Datos en el Cliente (Client-Side Rendering)**: En lugar de saturar el backend generando reportes de Excel, el panel administrativo descarga el crudo JSON y utiliza **SheetJS** para formatear y compilar archivos `.xlsx` nativamente en el navegador de la recepcionista o administrador.
- **Gestión Compleja de Estados (Dual-Booking Engine)**: Desarrollo de algoritmos lógicos en Sequelize para evitar colisiones. El sistema maneja calendarios cruzados, distinguiendo eventos en el local físico vs. eventos a domicilio, incluyendo bloqueos dinámicos automáticos.
- **Despliegue Profesional Real**: Configuración de un entorno de producción avanzado con un servidor VPS/cPanel donde el Backend de Node corre ininterrumpidamente vía **PM2**, protegido tras un Proxy Inverso (Apache), mientras el Frontend en Vite sirve estáticos súper ligeros. Todo amparado por conexiones WSS/HTTPS y JWT httpOnly.

---

## Arquitectura de Despliegue (Producción)

El paso a producción se realizó bajo un enfoque de separación de entornos en un servidor cPanel, utilizando dos dominios dedicados para mantener una arquitectura limpia:

- **Frontend**: `rancholoscorrales.com`
- **Backend API**: `api.parrilladacorrales.com` (Subdominio)

### 1. Base de Datos (MySQL)
Se realizó un volcado (dump) en formato `.sql` de la base de datos local y se migró al servidor de producción importándolo a través de **phpMyAdmin**. Este proceso mantuvo intactas todas las relaciones, índices y restricciones (Constraints) definidas previamente por el ORM (Sequelize).

### 2. Backend (API REST)
El despliegue del servidor Node.js se realizó de forma manual y controlada:
- **Transferencia Segura**: El código fuente fue subido al servidor vía **SFTP (FileZilla)**, excluyendo intencionalmente el directorio `node_modules` y el archivo `.env` local por seguridad.
- **Configuración en Servidor**: Las dependencias se instalaron directamente en producción vía **SSH** (`npm install`). Se creó un archivo `.env` nativo en el servidor con las credenciales definitivas de producción.
- **Gestión de Procesos**: La aplicación está administrada por **PM2** (Process Manager), garantizando disponibilidad continua (Zero Downtime) y reinicio automático ante posibles fallos del sistema.
- **Red y Seguridad**: 
  - Se configuró un **Proxy Inverso** mediante un archivo `.htaccess` para enrutar todo el tráfico HTTP entrante al puerto interno donde corre el proceso de Node.js.
  - El subdominio `api.parrilladacorrales.com` cuenta con un registro DNS tipo A y está protegido por un certificado **SSL/TLS** emitido automáticamente vía **AutoSSL** (cPanel), con redirección forzada a HTTPS.

### 3. Frontend (SPA)
El despliegue de la interfaz de usuario se optimizó para carga estática:
- **Variables de Entorno**: Configuración del `.env.production` local apuntando de forma dinámica al nuevo dominio de la API:
  ```env
  VITE_API_URL=https://api.parrilladacorrales.com/api
  ```
- **Build y Transpilación**: Se generó una versión optimizada y minificada ejecutando `npm run build` (Vite), lo que produjo los archivos estáticos en el directorio `dist/`.
- **Hosting de Archivos**: El contenido de `dist/` fue subido vía **SFTP** a la carpeta `public_html/` del dominio principal (`rancholoscorrales.com`), para ser servido directamente por **Apache**.
- **Manejo de Rutas (Client-Side Routing)**: Se implementó un archivo **`.htaccess`** específico en el frontend para redirigir todo el tráfico al `index.html`, permitiendo que *React Router DOM* gestione correctamente las URLs sin devolver errores 404.

### Comandos Clave de Mantenimiento (Operaciones)
Comandos utilizados en la terminal SSH para la gestión continua del servidor de producción:

```bash
# Conectarse al servidor vía SSH
ssh parrilladacorral@209.208.108.89

# Ver el estado actual del proceso del backend
./node_modules/.bin/pm2 list

# Reiniciar el backend tras aplicar actualizaciones (refrescando variables de entorno)
./node_modules/.bin/pm2 restart backend --update-env

# Monitorear los logs del sistema en tiempo real (últimas 50 líneas)
./node_modules/.bin/pm2 logs backend --lines 50
```

---

## Instalación y Ejecución Local (Guía Paso a Paso)

Si deseas clonar y probar este proyecto en tu entorno local, sigue las instrucciones a continuación.

<details>
<summary><b>Haz clic aquí para ver la Guía de Instalación y Ejecución Local</b></summary>

### 1. Prerrequisitos
- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
- [Git](https://git-scm.com/) para clonar el repositorio.
- **MySQL Server** corriendo localmente (XAMPP, WAMP, o nativo).
- Cuentas activas en **Cloudinary** y un servidor SMTP (ej. Gmail).

### 2. Clonar el Repositorio
```bash
git clone https://github.com/asporras7-dev/ProyectoRanchoLosCorrales.git
cd ProyectoRanchoLosCorrales
```

### 3. Configuración de la Base de Datos (MySQL)
1. Abre tu gestor de base de datos preferido (ej. phpMyAdmin, MySQL Workbench o DBeaver).
2. Crea una base de datos vacía con el nombre que prefieras (ejemplo: `parrillada_db_local`).
3. **Migraciones y Estructura**: Este proyecto utiliza el sistema de migraciones de Sequelize. Para crear todas las tablas y sus relaciones de forma estructurada, ejecutarás los comandos de migración más adelante (después de configurar tu archivo `.env`).

4. **Importar Datos Iniciales (Requerido para el Panel Admin)**: 
   Dado que las rutas de creación de usuarios están protegidas por seguridad, si inicias con una base de datos vacía no podrás acceder al panel de administración. 
   - **Opción A (Recomendada)**: Importa tu archivo `.sql` (dump de desarrollo/producción) directamente en phpMyAdmin o tu gestor. **Si haces esto, omite el paso de migraciones.**
   - **Opción B**: Si prefieres usar migraciones, tendrás que insertar manualmente un usuario con rol "Administrador" (y contraseña encriptada en Bcrypt) directamente en tu base de datos local para tu primer inicio de sesión.

### 4. Configuración del Backend (API)
1. Navega al Backend e instala dependencias:
   ```bash
   cd Backend
   npm install
   ```
2. Crea un archivo `.env` en **la raíz de la carpeta Backend** (`Backend/.env`) y configura tus datos locales:
   ```env
   # Base de Datos
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=parrillada_db_local
   DB_HOST=localhost
   DB_DIALECT=mysql

   # Autenticación (JWT)
   JWT_SECRET=tu_palabra_secreta_super_segura
   JWT_EXPIRES_IN=24h

   # Servidor de Correos (Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=tu_contraseña_de_aplicación

   # Entorno y URLs
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   PORT=5000

   # Cloudinary (Imágenes)
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```
3. **Migraciones (Solo si NO importaste el archivo .sql)**:
   ```bash
   npx sequelize-cli db:migrate
   ```
4. **Seeders (Opcional)**: Ejecuta el script de categorías iniciales si partiste de una base de datos vacía:
   ```bash
   node seed_categorias.js
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### 5. Configuración del Frontend
1. Abre una nueva terminal y navega al Frontend:
   ```bash
   cd Frontend
   npm install
   ```
2. Crea un archivo `.env` en la raíz del Frontend:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Inicia el servidor de Vite:
   ```bash
   npm run dev
   ```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:5000`.

</details>

---

## Estructura del Proyecto

<details>
<summary><b>Haz clic aquí para desplegar la Arquitectura de Carpetas</b></summary>

El proyecto sigue una arquitectura clásica de cliente-servidor (Full-Stack), separando claramente las responsabilidades:

```text
ProyectoRanchoLosCorrales/
├── Backend/                 # API RESTful en Node.js y Express
│   ├── config/              # Configuración de base de datos y variables
│   ├── controllers/         # Lógica de negocio de los endpoints
│   ├── middlewares/         # Middlewares (Auth JWT, validaciones)
│   ├── migrations/          # Migraciones de esquema de Base de Datos
│   ├── models/              # Modelos de datos de Sequelize
│   ├── routes/              # Definición de rutas del API
│   ├── scripts/             # Tareas programadas y scripts de utilidad
│   └── utils/               # Funciones auxiliares y formateadores
├── Frontend/                # SPA desarrollada con React y Vite
│   ├── src/                 
│   │   ├── assets/          # Archivos estáticos
│   │   ├── components/      # Componentes de UI (Públicos y Privados)
│   │   ├── img/             # Recursos de imágenes y multimedia
│   │   ├── pages/           # Vistas principales de la aplicación
│   │   ├── routes/          # Definición de enrutamiento
│   │   ├── services/        # Clientes HTTP y conexión al API
│   │   ├── styles/          # Hojas de estilo Vanilla CSS
│   │   └── utils/           # Utilidades compartidas del cliente
├── package.json             # Workspace y scripts de inicialización
├── package-lock.json        # Árbol de dependencias fijado
└── .gitignore               # Archivos excluidos de Git
```
</details>
