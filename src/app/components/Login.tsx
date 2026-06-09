import { useState, useEffect } from "react";
import { LogIn, GraduationCap, School } from "lucide-react";
import { supabase } from "../../supabaseClient";

interface LoginProps {
  onLogin: (
    role: "student" | "teacher",
    nombre: string,
    apellido: string,
    grado: string,
    password: string,
  ) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [grado, setGrado] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">(
    "student",
  );
  const [gradosDisponibles, setGradosDisponibles] = useState<string[]>([]);
  const [estudiantes, setEstudiantes] = useState<string[]>([]);

  // Al cargar, traer todos los grados únicos desde Supabase
  useEffect(() => {
    const fetchGrados = async () => {
      const { data, error } = await supabase.from("usuarios").select("grado");

      if (error) {
        console.error("Error cargando grados:", error.message);
      } else {
        const lista = [...new Set(data.map((u: any) => u.grado))];
        setGradosDisponibles(lista);
      }
    };

    fetchGrados();
  }, []);

  // Cuando cambia el grado, traer estudiantes de ese grado
  useEffect(() => {
  const fetchGrados = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*"); // traer todo

    if (error) {
      console.error("Error cargando usuarios:", error.message);
    } else {
      console.log("Usuarios encontrados:", data);
      const lista = [...new Set(data.map((u: any) => u.grado))];
      setGradosDisponibles(lista);
    }
  };

  fetchGrados();
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nombreCompletoFinal = nombreCompleto; // ya viene de Supabase

    const { data, error } = await supabase.from("usuarios").select("*");
    console.log("Usuarios:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-35 h-35 bg-blue-600 rounded-full mb-4 shadow-lg">
            <img
              src="/img/escudo.png"
              alt="Escudo Escuela"
              className="w-28 h-35 object-cover rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Ronditas EduTech
          </h1>
          <p className="text-gray-600">Plataforma educativa</p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Rol */}
            <div>
              <label className="block text-sm mb-3 text-gray-700">
                Ingresar como:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("student")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === "student"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                  }`}
                >
                  <GraduationCap className="w-8 h-8 mx-auto mb-2" />
                  <span className="block text-sm font-medium">Alumno</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("teacher")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedRole === "teacher"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"
                  }`}
                >
                  <School className="w-8 h-8 mx-auto mb-2" />
                  <span className="block text-sm font-medium">Maestro</span>
                </button>
              </div>
            </div>

            {/* Selector de Grado */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">Grado</label>
              <select
                value={grado}
                onChange={(e) => setGrado(e.target.value)}
                required
              >
                <option value="">Selecciona tu grado</option>
                {gradosDisponibles.length > 0 ? (
                  gradosDisponibles.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))
                ) : (
                  <option disabled>No hay grados disponibles</option>
                )}
              </select>
            </div>

            {/* Selector de Nombre y Apellido */}
            {grado && (
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Nombre y Apellido
                </label>
                <select
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors bg-white"
                  required
                >
                  <option value="">Selecciona tu nombre</option>
                  {estudiantes.map((est) => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Campo Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors bg-white"
                required
              />
            </div>

            {/* Botón de Ingresar */}
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                selectedRole === "student"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              <LogIn className="w-5 h-5" />
              Ingresar
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Educación de calidad para el futuro
        </p>
      </div>
    </div>
  );
}
