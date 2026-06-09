import { useState, useEffect } from "react";
import { LogIn, GraduationCap, School } from "lucide-react";

interface LoginProps {
  onLogin: (
    role: "student" | "teacher",
    nombreCompleto: string,
    grado: string,
    password: string,
  ) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [grado, setGrado] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">("student");
  const [gradosDisponibles, setGradosDisponibles] = useState<string[]>([]);
  const [estudiantes, setEstudiantes] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/grados")
      .then(res => res.json())
      .then(data => setGradosDisponibles(data))
      .catch(err => console.error("Error cargando grados:", err));
  }, []);

  useEffect(() => {
    if (!grado || selectedRole !== "student") return;
    fetch(`http://localhost:3001/estudiantes/${grado}`)
      .then(res => res.json())
      .then(data => {
        const lista = data.map((u: any) => u.nombre_completo);
        setEstudiantes(lista);
      })
      .catch(err => console.error("Error cargando estudiantes:", err));
  }, [grado, selectedRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, nombreCompleto || "David Getial", grado, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Ronditas EduTech</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Rol */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                selectedRole === "student"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              <GraduationCap size={20} /> Alumno
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                selectedRole === "teacher"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              <School size={20} /> Maestro
            </button>
          </div>

          {/* Si es estudiante → grados y nombres */}
          {selectedRole === "student" && (
            <>
              <select
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecciona tu grado</option>
                {gradosDisponibles.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              {grado && (
                <select
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Selecciona tu nombre</option>
                  {estudiantes.map((est) => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              )}
            </>
          )}

          {/* Si es maestro → nombre fijo */}
          {selectedRole === "teacher" && (
            <input
              type="text"
              value="David Getial"
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
            />
          )}

          {/* Password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Botón */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            <LogIn size={20} /> Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
