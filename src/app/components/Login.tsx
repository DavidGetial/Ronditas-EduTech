import { useState, useEffect } from "react";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [grado, setGrado] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("student");
  const [gradosDisponibles, setGradosDisponibles] = useState<string[]>([]);
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Cargar grados desde backend
  useEffect(() => {
    fetch("http://localhost:3001/grados")
      .then(res => res.json())
      .then(data => setGradosDisponibles(data))
      .catch(() => setGradosDisponibles([]));
  }, []);

  // Cargar estudiantes según grado
  useEffect(() => {
    if (grado) {
      fetch(`http://localhost:3001/estudiantes/${grado}`)
        .then(res => res.json())
        .then(data => setEstudiantes(data))
        .catch(() => setEstudiantes([]));
    }
  }, [grado]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: nombreCompleto,
          grado,
          password,
          rol,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error en login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        onLogin(data.user); // 👈 solo pasamos el objeto user
      } else {
        setError(data.message || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-indigo-700">Ingreso Ronditas EduTech</h1>

        {/* Selección de rol */}
        <div>
          <label className="block text-gray-700">Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="student">Estudiante</option>
            <option value="teacher">Docente</option>
          </select>
        </div>

        {/* Selección de grado (solo estudiantes) */}
        {rol === "student" && (
          <div>
            <label className="block text-gray-700">Grado</label>
            <select
              value={grado}
              onChange={(e) => setGrado(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Seleccione grado</option>
              {gradosDisponibles.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selección de nombre */}
        <div>
          <label className="block text-gray-700">Nombre completo</label>
          {rol === "student" ? (
            <select
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Seleccione estudiante</option>
              {estudiantes.map((est) => (
                <option key={est.id} value={est.nombre_completo}>
                  {est.nombre_completo}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Nombre completo"
            />
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Ingrese su contraseña"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
