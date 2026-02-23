import { Router } from "express"
import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from "../controllers/article.controller"
import { authMiddleware } from "../middleware/authMiddleware"

const articleRouter = Router()

// GET - http://localhost:50000/api/articles (Público)
articleRouter.get("/", getArticles)

// DETALLE - GET - http://localhost:50000/api/articles/:id (Público)
// Esta ruta captura el ID que envía el frontend y lo pasa al controlador
articleRouter.get("/:id", getArticleById)

// Rutas Protegidas (Requieren JWT)
articleRouter.post("/", authMiddleware, createArticle)
articleRouter.patch("/:id", authMiddleware, updateArticle)
articleRouter.delete("/:id", authMiddleware, deleteArticle)

export { articleRouter }