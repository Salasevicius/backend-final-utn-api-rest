import { Types } from "mongoose"

interface IPayload {
  _id: Types.ObjectId
  email: string
  username: string
}

export { IPayload }