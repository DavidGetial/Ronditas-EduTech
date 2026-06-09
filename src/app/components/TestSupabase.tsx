import { useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function TestSupabase() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("usuarios").select("*");

      if (error) {
        console.error("❌ Error de conexión:", error.message);
      } else {
        console.log("✅ Conexión exitosa. Registros encontrados:", data);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Prueba de Supabase</h1>
      <p>Revisa la consola del navegador (F12 → Console) para ver todos los registros.</p>
    </div>
  );
}
