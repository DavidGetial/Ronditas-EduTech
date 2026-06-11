import { useState, useEffect } from "react";
import { LogOut, Upload } from "lucide-react";

interface StudentDashboardProps {
  onLogout: () => void;
  estudiante: string;
  periodo: number;
}

interface Recurso {
  id: number;
  titulo: string;
  tipo: "taller" | "examen" | "guia";
}

export default function StudentDashboard({ onLogout, estudiante, periodo }: StudentDashboardProps) {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);

  // Cargar recursos del periodo
  useEffect(() => {
    fetch(`http://localhost:3001/recursos/${periodo}`)
      .then(res => res.json())
      .then(data => setRecursos(data));
  }, [periodo]);

  const handleUpload = async () => {
    if (!selectedRecurso) {
      alert("Debes seleccionar un recurso primero");
      return;
    }
    if (!archivo) {
      alert("Debes elegir un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo); // archivo real
    formData.append("recurso_id", String(selectedRecurso.id));
    formData.append("estudiante", estudiante);

    const res = await fetch("http://localhost:3001/entregas", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Entrega subida correctamente");
      setArchivo(null);
      setSelectedRecurso(null);
    } else {
      alert("Error al subir la entrega");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <header className="bg-white shadow-sm border-b-2 border-indigo-100 p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-indigo-600">Panel del Estudiante – Periodo {periodo}</h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Lista de recursos */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recursos disponibles</h2>
          {recursos.map(r => (
            <div key={r.id} className="p-4 border rounded-lg mb-2 flex justify-between">
              <span>{r.tipo.toUpperCase()}: {r.titulo}</span>
              <button
                onClick={() => setSelectedRecurso(r)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>

        {/* Subir entrega */}
        {selectedRecurso && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Subir Entrega</h2>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className="mb-4"
            />
            <button
              onClick={handleUpload}
              disabled={!archivo}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 disabled:bg-gray-400"
            >
              <Upload className="w-5 h-5" /> Enviar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
