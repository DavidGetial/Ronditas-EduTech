import { useState } from "react";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

export default function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (loggedUser: any) => {
    console.log("✅ Login exitoso:", loggedUser);

    // Si el backend devuelve { success, user }, extraemos user
    const usuario = loggedUser.user ? loggedUser.user : loggedUser;

    setUser({
      ...usuario,
      rol: usuario.rol?.toLowerCase().trim(), // normalización
    });
  };


  const handleLogout = () => {
    setUser(null);
  };

  // Si no hay usuario logueado → mostrar login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Si es estudiante → mostrar StudentDashboard
  if (user.rol === "student") {
    return (
      <StudentDashboard
        onLogout={handleLogout}
        estudiante={user.nombre_completo}
        periodo={2} // 👈 aquí defines el periodo actual
      />
    );
  }

  // Si es profesor → mostrar TeacherDashboard
  if (user.rol === "teacher") {
    return (
      <TeacherDashboard
        onLogout={handleLogout}
        profesor={user.nombre_completo}
      />
    );
  }

  // Si el rol no coincide → fallback
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Rol desconocido</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
