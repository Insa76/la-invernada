import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import animalRoutes from "./routes/animal.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// 🔥 CORS (podés ajustar después si querés)
app.use(cors());

// 🔥 JSON
app.use(express.json());

// 🔥 CREAR carpeta uploads automáticamente
const uploadDir = path.join(process.cwd(), "src/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Carpeta uploads creada");
}

// 🔥 SERVIR archivos estáticos
app.use("/uploads", express.static(uploadDir));

// 🔥 ROUTES
app.use("/api/animals", animalRoutes);
app.use("/api/auth", authRoutes);

// 🔥 SERVER
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});