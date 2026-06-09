import { useState } from "react";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import { supabase } from "../supabaseClient";
import TestSupabase from "./components/TestSupabase";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null);

  // Manejo de login
  const handleLogin = async (
    role: "student" | "teacher",
    nombre: string,
    apellido: string,
    grado: string,
    password: string,
  ) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("nombre", nombre)
      .eq("apellido", apellido)
      .eq("grado", grado)
      .eq("password", password)
      .eq("rol", role)
      .single();

    if (error || !data) {
      alert("Usuario o contraseña incorrectos");
    } else {
      console.log("✅ Login exitoso:", data);
      setUserRole(role);
      setIsLoggedIn(true);
    }
  };

  // Manejo de logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Si no está logueado → mostrar Login + TestSupabase
  if (!isLoggedIn) {
    return (
      <>
        <TestSupabase />
        <Login
          onLogin={(role, nombre, apellido, grado, password) =>
            handleLogin(role, nombre, apellido, grado, password)
          }
        />
      </>
    );
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
