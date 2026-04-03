import express from "express"
import cors from "cors"
import { connectDb } from "./config/mongodb"
import { articleRouter } from "./routes/articleRouter"
import { authRouter } from "./routes/authRouter"
import { IPayload } from "./interfaces/IPayload"
import dotenv from "dotenv"

dotenv.config()

const serverHttp = express()

// --- CONFIGURACIÓN DE PRERENDER (CAPA DE SEO DINÁMICO) ---
// Se coloca al inicio para interceptar bots antes de cualquier otra ruta
const prerender = require('prerender-node')
  .set('prerenderToken', process.env.PRERENDER_TOKEN)
  .set('protocol', 'https')
  .set('forwardHeaders', true);

serverHttp.use(prerender);
// ------------------------------------------------------

// Extensión del objeto Request para TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: IPayload
    }
  }
}

// Middlewares globales
serverHttp.use(cors()) 
serverHttp.use(express.json())

// RUTAS PRINCIPALES
serverHttp.use("/api/articles", articleRouter)
serverHttp.use("/auth", authRouter)

// --- NUEVA RUTA RAÍZ PARA EVITAR EL 404 EN PRERENDER ---
serverHttp.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Proyecto Cultura Rosario - Operativa",
    timestamp: new Date().toISOString()
  });
});

// Ruta de Salud (Opcional, útil para que Render verifique que el servicio está vivo)
serverHttp.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Error 404
serverHttp.use((req, res) => {
  res.status(404).json({ success: false, error: "El recurso no se encuentra" })
})

const PORT = process.env.PORT || 50000

serverHttp.listen(PORT, () => {
  try {
    console.log(`✅ Servidor Cultura Rosario activo en: http://127.0.0.1:${PORT}`)
    connectDb()
  } catch (error) {
    const err = error as Error
    console.log("❌ Error al iniciar:", err.message)
    process.exit(1)
  }
})