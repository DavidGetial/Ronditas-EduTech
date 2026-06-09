import { useState } from "react";
import { LogIn, GraduationCap, School } from "lucide-react";

interface LoginProps {
  onLogin: (role: "student" | "teacher") => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">(
    "student",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(selectedRole);
    }
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

            {/* Campo de Usuario */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm mb-2 text-gray-700"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none transition-colors bg-white"
                required
              />
            </div>

            {/* Campo de Contraseña */}
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
