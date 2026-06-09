import express from "express";
import cors from "cors";
import pool from "./db.ts"; // tu conexión a la base de datos

const app = express();
app.use(express.json());
app.use(cors());

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
    console.log("Datos recibidos en login:", req.body);

    const { nombre_completo, grado, password, rol } = req.body;

    let query, params;
    if (rol === "teacher") {
      query = "SELECT * FROM public.usuarios WHERE nombre_completo = $1 AND rol = $2";
      params = [nombre_completo, rol];
    } else {
      query = "SELECT * FROM public.usuarios WHERE nombre_completo = $1 AND grado = $2 AND rol = $3";
      params = [nombre_completo, grado, rol];
    }


    const result = await pool.query(query, params);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.password.trim() === password.trim()) {
        res.json({ success: true, user });
      } else {
        res.status(401).json({
          success: false,
          message: `Contraseña incorrecta. La correcta es: ${user.password}`
        });
      }
    } else {
      res.status(401).json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Servidor backend corriendo en http://localhost:3001");
});
