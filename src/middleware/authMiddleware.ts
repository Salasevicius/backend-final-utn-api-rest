import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"
import { IPayload } from "../interfaces/IPayload"

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization

  const JWT_SECRET = process.env.JWT_SECRET

  if (!header) {
    return res.status(401).json({ success: false, error: "el token es requerido" })
  }

  if (!header.startsWith("Bearer")) {
    return res.status(401).json({ success: false, error: "el token debe ser formato jwt" })
  }

  const array = header.split(" ")

  const token = array[1]


  if (!token) {
    return res.status(401).json({ success: false, error: "token invalido" })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)

    req.user = payload as IPayload

    next()
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export { authMiddleware }