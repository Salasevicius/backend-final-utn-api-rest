import { Request, Response } from "express";
import mongoose from "mongoose";
import { Article } from "../models/article.model";
import { articlePartialValidate, articleValidate } from "../validators/articleValidator";

// Definimos una interfaz para extender Request y evitar errores de tipado en req.user
interface AuthRequest extends Request {
  user?: any;
}

// 1. OBTENER TODOS LOS ARTÍCULOS (Público)
const getArticles = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: articles });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. OBTENER UN ARTÍCULO POR ID (Público - Crucial para acceder a la lectura de los artículos en el front)
const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validación de ID compatible con TypeScript
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "ID de artículo no válido" });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ success: false, error: "El recurso no se encuentra" });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. CREAR ARTÍCULO (Protegido)
const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const articleData = { ...req.body, userId };

    const validate = articleValidate.safeParse(articleData);

    if (!validate.success) {
      return res.status(400).json({
        success: false,
        error: validate.error.flatten().fieldErrors
      });
    }

    const createdArticle = await Article.create(articleData);
    res.status(201).json({ success: true, data: createdArticle });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. ACTUALIZAR ARTÍCULO (Protegido - Solo Dueño)
const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "ID inválido" });
    }

    const validate = articlePartialValidate.safeParse(updates);
    if (!validate.success) {
      return res.status(400).json({ success: false, error: validate.error.flatten().fieldErrors });
    }

    const updatedArticle = await Article.findOneAndUpdate(
      { _id: id, userId: userId },
      updates,
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ success: false, error: "Artículo no encontrado o no tienes permiso" });
    }

    res.json({ success: true, data: updatedArticle });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. BORRAR ARTÍCULO (Protegido - Solo Dueño)
const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "ID incorrecto" });
    }

    const deletedArticle = await Article.findOneAndDelete({ _id: id, userId: userId });

    if (!deletedArticle) {
      return res.status(404).json({ success: false, error: "No existe el artículo o no tienes permiso para borrarlo" });
    }

    res.json({ success: true, data: deletedArticle });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };