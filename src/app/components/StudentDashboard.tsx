import { useState, useEffect } from "react";
import {
  Upload,
  FileQuestion,
  History,
  LogOut,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";

interface StudentDashboardProps {
  onLogout: () => void;
  estudiante: string; // nombre del estudiante logueado
  periodo: number;    // periodo actual
}

interface Recurso {
  id: number;
  titulo: string;
  tipo: "taller" | "examen" | "guia";
  periodo: number;
}

interface Entrega {
  id: number;
  recurso_id: number;
  estudiante: string;
  archivo: string;
  estado: "pendiente" | "entregado";
  nota?: number;
  feedback?: string;
  titulo?: string;
  tipo?: string;
}

export default function StudentDashboard({ onLogout, estudiante, periodo }: StudentDashboardProps) {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRecurso, setSelectedRecurso] = useState<number | null>(null);

  // Cargar recursos del periodo
  useEffect(() => {
    if (!periodo) return; // evita llamadas con undefined
    fetch(`http://localhost:3001/recursos/${periodo}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecursos(data);
        } else {
          setRecursos([]);
        }
      })
      .catch(() => setRecursos([]));
  }, [periodo]);

  // Cargar entregas del estudiante
  useEffect(() => {
    if (!periodo) return;
    fetch(`http://localhost:3001/entregas/${periodo}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const propias = data.filter((e: Entrega) => e.estudiante === estudiante);
          setEntregas(propias);
        } else {
          setEntregas([]);
        }
      })
      .catch(() => setEntregas([]));
  }, [periodo, estudiante]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, recursoId: number) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedRecurso(recursoId);
    }
  };

  const handleUploadSubmit = async () => {
    if (selectedFile && selectedRecurso) {
      await fetch("http://localhost:3001/entregas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recurso_id: selectedRecurso,
          estudiante,
          archivo: selectedFile.name,
        }),
      });
      alert(`Entrega subida: ${selectedFile.name}`);
      setSelectedFile(null);
      setSelectedRecurso(null);
    }
  };

  // Estadísticas
  const entregados = entregas.filter(e => e.estado === "entregado").length;
  const pendientes = recursos.length - entregados;
  const promedio = (() => {
    const calificados = entregas.filter(e => e.nota);
    if (calificados.length === 0) return 0;
    return (calificados.reduce((acc, e) => acc + (e.nota || 0), 0) / calificados.length).toFixed(1);
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="bg-white shadow-sm border-b-2 border-blue-100 p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-indigo-700">Informática – Periodo {periodo}</h1>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">¡Bienvenido, {estudiante}!</h2>

        {/* Recursos */}
        {Array.isArray(recursos) && recursos.map(r => (
          <div key={r.id} className="p-4 border rounded-lg mb-4">
            <h3 className="font-semibold">{r.tipo.toUpperCase()}: {r.titulo}</h3>
            <input type="file" onChange={(e) => handleFileChange(e, r.id)} />
            <button onClick={handleUploadSubmit} disabled={!selectedFile || selectedRecurso !== r.id}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Subir Entrega
            </button>
          </div>
        ))}

        {/* Estadísticas */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-600 text-white p-6 rounded-xl">
            <p>Entregados</p><p className="text-3xl font-bold">{entregados}</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-xl">
            <p>Pendientes</p><p className="text-3xl font-bold">{pendientes}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-xl">
            <p>Promedio</p><p className="text-3xl font-bold">{promedio}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
