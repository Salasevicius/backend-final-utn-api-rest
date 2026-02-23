import { User } from "../models/user.model"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response } from "express"
import { IPayload } from "../interfaces/IPayload"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("Debes ingresar credenciales para jwt")
}

const register = async (req: Request, res: Response) => {
  try {
    const body = req.body

    const { email, password, username } = body

    // implementar validaciones de input con ZOD
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, error: "data invalida, revisa los datos compartidos" })
    }

    // gabi3@gmail.com
    if (!email.includes("@") || !email.endsWith(".com")) {
      return res.status(400).json({ success: false, error: "el correo electronico debería ser un email valido" })
    }

    if (password.length < 4) {
      return res.status(400).json({ success: false, error: "la contraseña debe contar al menos con 5 caracteres" })
    }

    const foundUser = await User.findOne({ email })

    if (foundUser) {
      return res.status(400).json({ success: false, error: "Email ya existente en nuestra base de datos" })
    }

    const hash = await bcryptjs.hash(password, 10)

    const newDataUser = {
      email,
      password: hash,
      username
    }

    const newUser = await User.create(newDataUser)

    res.status(201).json({
      success: true, data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const { email, password } = body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "data invalida, ingrese los datos requeridos" })
    }

    const foundUser = await User.findOne({ email })

    if (!foundUser) {
      return res.status(401).json({ success: false, error: "desautorizado" })
    }

    // const validatePassword = await bcryptjs.compare(password, foundUser.password)
    const validatePassword = await bcryptjs.compare(password, foundUser.password)

    if (!validatePassword) {
      return res.status(401).json({ succes: false, error: "desautorizado" })
    }

    // generar un token (cupón especial)
    // Un token es una llave digital o un fragmento de información que sirve para autenticar y autorizar a un usuario en sistemas digitales

    const payload: IPayload = { _id: foundUser._id, username: foundUser.username, email: foundUser.email }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })

    res.json({ success: true, data: token, userId: foundUser._id })
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export { register, login }