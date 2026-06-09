import { useState } from "react";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null);

  // Manejo de login → ahora solo llama al backend Express
  const handleLogin = async (
    role: "student" | "teacher",
    nombreCompleto: string,
    grado: string,
    password: string,
  ) => {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_completo: nombreCompleto,
        grado,
        password,
        rol: role,
      }),
    });

    const data = await res.json();
    if (data.success) {
      console.log("✅ Login exitoso:", data.user);
      setUserRole(role);
      setIsLoggedIn(true);
    } else {
      alert(data.message || "Usuario o contraseña incorrectos");
    }
  };

  // Manejo de logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Si no está logueado → mostrar Login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Dashboards según rol
  if (userRole === "student") {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  if (userRole === "teacher") {
    return <TeacherDashboard onLogout={handleLogout} />;
  }

  return null;
}
