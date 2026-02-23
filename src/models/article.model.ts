import { Schema, model } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Destacados', 'Microbiografías', 'Literarios', 'Periodísticos', 'Opinión']
    },
    imageUrl: { type: String, required: true },
    link: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Debe coincidir con el nombre que se le dió al modelo de Usuario
      required: true
    },
  },
  { timestamps: true }
);

export const Article = model("Article", ArticleSchema);