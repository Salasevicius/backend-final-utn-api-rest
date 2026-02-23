# Proyecto Cultura API 🎭

API REST desarrollada para la gestión de artículos culturales, implementando seguridad, filtrado avanzado y arquitectura basada en el patrón **MVC**. Este proyecto forma parte del trabajo final de la cursada de Desarrollo Web Backend.

---

## 🚀 Tecnologías Utilizadas

* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Framework:** [Express](https://expressjs.com/)
* **Base de Datos:** [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/)
* **Validación de Datos:** [Zod](https://zod.dev/)
* **Seguridad:** [JWT](https://jwt.io/) (JSON Web Token) & [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* **Documentación:** Colección de [Bruno](https://www.usebruno.com/) (incluida en el repositorio)

---

## 🛠️ Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
***Crea un archivo .env en la raíz del proyecto basándote en el archivo .env.example:***
   ```bash
   PORT=50000
   URI_DB=tu_conexion_mongodb
   JWT_SECRET=tu_palabra_secreta
   JWT_EXPIRES=1h
   ``` 

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev 
   ```

## 🔍 Filtrado por Query Params (Requisito de Investigación)
### Se implementó un sistema de búsqueda flexible en el endpoint de artículos para cumplir con el requisito de investigación individual. El cliente puede filtrar contenido por categoría mediante la URL:
GET /api/articles?category=Literarios

### Características del filtrado:
Case Insensitive: La búsqueda es insensible a mayúsculas y minúsculas (gracias a la opción i en MongoDB).

### Búsqueda Parcial:
Utiliza expresiones regulares ($regex), permitiendo encontrar resultados aunque no se escriba la palabra completa.

## 📡 Endpoints del Proyecto
### 🔐 Autenticación (/auth)
Método	Endpoint	Descripción
* POST	/register	Registra un nuevo usuario en la base de datos.
* POST	/login	Autentica al usuario y devuelve un Token JWT.

### 📄 Artículos (/api/articles)
* **GET**	/	Público	Lista todos los artículos para que cualquier visitante pueda leerlos (soporta query params).
* **GET**	/:id	Público	Obtiene el detalle de un artículo específico.
* **POST**	/	Privado	Crea un artículo. (Requiere Token. Solamente usuarios registrados pueden crear artículos).
* **PATCH**	/:id	Privado	Edita un artículo. (Solamente el autor puede editar el artículo).
* **DELETE**	/:id	Privado	Elimina un artículo (Solamente el autor puede eliminar el artículo).

## 📂 Estructura del Proyecto (MVC)
El proyecto sigue una estructura organizada para facilitar la escalabilidad:

* src/models: Definición de esquemas de Mongoose.

* src/controllers: Lógica de negocio y manejo de peticiones.

* src/routes: Definición de rutas y aplicación de middlewares.

* src/validators: Esquemas de validación con Zod.

* src/config: Configuración de base de datos y variables de entorno.

## 📚 Documentación Complementaria
Siguiendo las sugerencias de la cursada, se ha utilizado DeepWiki para complementar la documentación técnica de los modelos y la arquitectura interna del proyecto. Puedes encontrar la colección de solicitudes de Bruno en la carpeta /bruno dentro de este repositorio para realizar pruebas de los endpoints mencionados.