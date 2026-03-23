import express from "express"
import cors from "cors"
import { connectDb } from "./config/mongodb"
import { articleRouter } from "./routes/articleRouter"
import { authRouter } from "./routes/authRouter"
import { IPayload } from "./interfaces/IPayload"
import dotenv from "dotenv"

dotenv.config()

const serverHttp = express()

// --- CONFIGURACIÓN DE PRERENDER (PARA SEO DINÁMICO) ---
// Usamos require para evitar el error de tipos (404 @types)
const prerender = require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN);
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

// Middlewares globales requeridos por la consigna
serverHttp.use(cors()) // Habilitación de solicitudes externas
serverHttp.use(express.json())

// RUTAS PRINCIPALES
serverHttp.use("/api/articles", articleRouter)
serverHttp.use("/auth", authRouter)

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