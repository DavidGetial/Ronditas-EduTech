import express from "express";
import cors from "cors";
import pool from "./db.ts"; // tu conexión a la base de datos

const app = express();
app.use(express.json());
app.use(cors());

/* ===========================
   ENDPOINTS DE USUARIOS
=========================== */

// Endpoint: grados (solo estudiantes)
app.get("/grados", async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT grado FROM public.usuarios WHERE rol = 'student'"
    );
    res.json(result.rows.map((r: any) => r.grado));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: estudiantes por grado
app.get("/estudiantes/:grado", async (req: express.Request, res: express.Response) => {
  try {
    const { grado } = req.params;
    const result = await pool.query(
      "SELECT id, nombre_completo FROM public.usuarios WHERE grado = $1 AND rol = 'student'",
      [grado]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("Error en /estudiantes:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: login
app.post("/login", async (req: express.Request, res: express.Response) => {
  try {
    const { nombre_completo, grado, password, rol } = req.body;

    let query, params;

    // Si es docente
    if (rol === "teacher") {
      query = "SELECT * FROM public.usuarios WHERE nombre_completo = $1 AND rol = 'teacher'";
      params = [nombre_completo];
    } 
    // Si es estudiante
    else {
      query = "SELECT * FROM public.usuarios WHERE nombre_completo = $1 AND grado = $2 AND rol = 'student'";
      params = [nombre_completo, grado];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Validación estricta de contraseña
    if (user.password.trim() !== password.trim()) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    // Normalizar rol para frontend
    user.rol = user.rol?.toLowerCase().trim();

    return res.json({ success: true, user });

  } catch (err: any) {
    console.error("Error en /login:", err.message);
    res.status(500).json({ error: err.message });
  }
});



/* ===========================
   ENDPOINTS DE RECURSOS (Profesor)
=========================== */

// Crear recurso
app.post("/recursos", async (req: express.Request, res: express.Response) => {
  try {
    const { titulo, tipo, periodo, creado_por } = req.body;
    const result = await pool.query(
      "INSERT INTO recursos (titulo, tipo, periodo, creado_por) VALUES ($1,$2,$3,$4) RETURNING *",
      [titulo, tipo, periodo, creado_por]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Ver recursos por periodo
app.get("/recursos/:periodo", async (req: express.Request, res: express.Response) => {
  try {
    const { periodo } = req.params;
    const result = await pool.query("SELECT * FROM recursos WHERE periodo = $1", [periodo]);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   ENDPOINTS DE ENTREGAS (Estudiantes)
=========================== */

// Subir entrega
app.post("/entregas", async (req: express.Request, res: express.Response) => {
  try {
    const { recurso_id, estudiante, archivo } = req.body;
    const result = await pool.query(
      "INSERT INTO entregas (recurso_id, estudiante, archivo, estado) VALUES ($1,$2,$3,'entregado') RETURNING *",
      [recurso_id, estudiante, archivo]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Ver entregas por periodo
app.get("/entregas/:periodo", async (req: express.Request, res: express.Response) => {
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

// Calificar entrega
app.put("/entregas/:id", async (req: express.Request, res: express.Response) => {
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
