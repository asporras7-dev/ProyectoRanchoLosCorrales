require('dotenv').config(); // Cargar variables de entorno al inicio
const express = require("express") // Llama al servidor de express para subir el servidor

const cors = require ('cors')
const cookieParser = require('cookie-parser');

const app = express() // Lo instancia, para usarlo por medio de app
app.set("trust proxy", 1); // Confiar en el proxy de Render para las cookies seguras
 
const sequelize = require("./config/db") // Llama al ORM y a la configuración de la base de datos

require("./index") // Llama a todos los modelos para que se creen en la base de datos, por medio de sequelize

app.use(express.json()) // El servidor va a entender JSON

app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'https://parrilladacorrales.com',
      'https://www.parrilladacorrales.com',
      'https://rancholoscorrales.com',
      'https://www.rancholoscorrales.com',
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

app.options('*', cors());

app.use(cookieParser());

/*
    Conexión por medio de  sequelize, con la base de datos, y luego levanta el servidor
*/

// Importación de rutas
const usuarioRoutes = require("./routes/UsuarioRoutes")
const rolRoutes = require("./routes/RolRoutes")
const menuRoutes = require("./routes/MenuRoutes")
const categoriaRoutes = require("./routes/CategoriaRoutes")
const servicioAdicionalRoutes = require("./routes/ServicioAdicionalRoutes")
const reservaRoutes = require("./routes/ReservaRoutes")
const menuADomicilioRoutes = require("./routes/MenuADomicilioRoutes")
const reservaADomicilioRoutes = require("./routes/ReservaADomicilioRoutes")
const servicioAdicionalReservaRoutes = require("./routes/ServicioAdicionalReservaRoutes")
const decoracionTematicaRoutes = require("./routes/DecoracionTematicaRoutes")
const authRoutes = require("./routes/AuthRoutes")
const fechasBloqueadasRoutes = require("./routes/FechasBloqueadasRoutes")
const fechasBloqueadasADomicilioRoutes = require("./routes/FechasBloqueadasADomicilioRoutes")

// Registro de rutas
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/roles", rolRoutes)
app.use("/api/menus", menuRoutes)
app.use("/api/categorias", categoriaRoutes)
app.use("/api/servicios-adicionales", servicioAdicionalRoutes)
app.use("/api/reservas", reservaRoutes)
app.use("/api/menus-a-domicilio", menuADomicilioRoutes)
app.use("/api/reservas-a-domicilio", reservaADomicilioRoutes)
app.use("/api/servicios-reservas", servicioAdicionalReservaRoutes)
app.use("/api/decoraciones-tematicas", decoracionTematicaRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/fechas-bloqueadas", fechasBloqueadasRoutes)
app.use("/api/fechas-bloqueadas-a-domicilio", fechasBloqueadasADomicilioRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/*
    alter true permite modificaciones dentro de las tablas por medio de sequelize
    Sin tener que eliminar tablas o la base de datos
*/
//sequelize.sync({ force: false })
 // .then(() => console.log("✅ Base de datos sincronizada"))
  //.catch(error => console.error("❌ Error sincronizando DB:", error));


// ✅ Así Render puede asignar el puerto correctamente
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
