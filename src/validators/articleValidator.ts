import { z } from "zod";

const articleValidate = z.object({
  title: z.string().min(5),
  author: z.string().min(3),
  description: z.string().min(10),
  content: z.string().min(20),
  category: z.enum(['Destacados', 'Microbiografías', 'Literarios', 'Periodísticos', 'Opinión']),
  imageUrl: z.string().min(1),
  imageMobileUrl: z.string().url().optional().or(z.string().min(1).optional()), // Validación flexible
  link: z.string().optional(),
  userId: z.string().optional()
});

const articlePartialValidate = articleValidate.partial();

export { articleValidate, articlePartialValidate };