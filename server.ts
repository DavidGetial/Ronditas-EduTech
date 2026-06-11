import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import pool from "./db.ts";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// reconstruir __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/* ===========================
   ENDPOINTS DE USUARIOS
=========================== */

app.get("/grados", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT grado FROM public.usuarios WHERE rol = 'student'"
    );
    res.json(result.rows.map((r: any) => r.grado));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/estudiantes/:grado", async (req: Request, res: Response) => {
  try {
    const { grado } = req.params;
    const result = await pool.query(
      "SELECT id, nombre_completo FROM public.usuarios WHERE grado = $1 AND rol = 'student'",
      [grado]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { nombre_completo, grado, password, rol } = req.body;
    let query, params;

    if (rol === "teacher") {
      query = "SELECT * FROM public.usuarios WHERE nombre_completo = $1 AND rol = 'teacher'";
      params = [nombre_completo];
    } else {
      query = "SELECT * FROM public.usuarios WHERE nombre_completo = $1 AND grado = $2 AND rol = 'student'";
      params = [nombre_completo, grado];
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    if (user.password.trim() !== password.trim()) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    user.rol = user.rol?.toLowerCase().trim();
    return res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   ENDPOINTS DE RECURSOS
=========================== */

app.post("/recursos", async (req: Request, res: Response) => {
  try {
    const { titulo, tipo, periodo, creado_por, descripcion, fecha_limite, comentarios } = req.body;
    const result = await pool.query(
      "INSERT INTO recursos (titulo, tipo, periodo, creado_por, descripcion, fecha_limite, comentarios) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [titulo, tipo, periodo, creado_por, descripcion, fecha_limite, comentarios]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/recursos/:periodo", async (req: Request, res: Response) => {
  try {
    const { periodo } = req.params;
    const result = await pool.query("SELECT * FROM recursos WHERE periodo = $1", [periodo]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   ENDPOINTS DE ENTREGAS
=========================== */

app.post("/entregas", upload.single("archivo"), async (req: Request, res: Response) => {
  try {
    const { recurso_id, estudiante } = req.body;
    const archivo = (req.file as Express.Multer.File)?.filename;

    if (!archivo) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    const result = await pool.query(
      "INSERT INTO entregas (recurso_id, estudiante, archivo, estado) VALUES ($1,$2,$3,'entregado') RETURNING *",
      [recurso_id, estudiante, archivo]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Error en /entregas:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/entregas/:periodo", async (req: Request, res: Response) => {
  try {
    const { periodo } = req.params;
    const result = await pool.query(
      `SELECT e.*, r.titulo, r.tipo 
       FROM entregas e 
       JOIN recursos r ON e.recurso_id = r.id 
       WHERE r.periodo = $1`,
      [periodo]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/entregas/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nota, feedback } = req.body;
    const result = await pool.query(
      "UPDATE entregas SET nota=$1, feedback=$2 WHERE id=$3 RETURNING *",
      [nota, feedback, id]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   INICIO DEL SERVIDOR
=========================== */

app.listen(3001, () => {
  console.log("Servidor backend corriendo en http://localhost:3001");
});
