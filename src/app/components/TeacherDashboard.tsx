import { useState, useEffect } from "react";
import { LogOut, BookOpen, FileText, Eye, Star, CheckCircle, Clock } from "lucide-react";

interface TeacherDashboardProps {
  onLogout: () => void;
  profesor: string;
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
  estado: string;
  nota?: number;
  feedback?: string;
  titulo?: string;
  tipo?: string;
}

export default function TeacherDashboard({ onLogout, profesor }: TeacherDashboardProps) {
  const [periodo, setPeriodo] = useState(2);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<"taller" | "examen" | "guia">("taller");
  const [nota, setNota] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);

  // Cargar recursos
  useEffect(() => {
    fetch(`http://localhost:3001/recursos/${periodo}`)
      .then(res => res.json())
      .then(data => setRecursos(data));
  }, [periodo]);

  // Cargar entregas
  useEffect(() => {
    fetch(`http://localhost:3001/entregas/${periodo}`)
      .then(res => res.json())
      .then(data => setEntregas(data));
  }, [periodo]);

  const handleCrearRecurso = async () => {
    await fetch("http://localhost:3001/recursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, tipo, periodo, creado_por: profesor }),
    });
    alert(`Recurso creado: ${titulo}`);
    setTitulo("");
  };

  const handleCalificar = async () => {
    if (selectedEntrega) {
      await fetch(`http://localhost:3001/entregas/${selectedEntrega.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota: parseFloat(nota), feedback }),
      });
      alert("Calificación guardada");
      setNota("");
      setFeedback("");
      setSelectedEntrega(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <header className="bg-white shadow-sm border-b-2 border-orange-100 p-4 flex justify-between">
        <h1 className="text-2xl font-bold text-orange-600">Panel del Maestro – Periodo {periodo}</h1>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Selector de periodo */}
        <div className="flex gap-2">
          {[1, 2, 3].map(p => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-4 py-2 rounded-lg ${periodo === p ? "bg-orange-600 text-white" : "bg-gray-200"}`}
            >
              Periodo {p}
            </button>
          ))}
        </div>

        {/* Crear recurso */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Crear Recurso</h2>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del recurso"
            className="border p-2 w-full mb-2 rounded-lg"
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} className="border p-2 w-full mb-2 rounded-lg">
            <option value="taller">Taller</option>
            <option value="examen">Examen</option>
            <option value="guia">Guía</option>
          </select>
          <button onClick={handleCrearRecurso} className="px-4 py-2 bg-orange-600 text-white rounded-lg">
            Crear
          </button>
        </div>

        {/* Lista de recursos */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recursos del Periodo</h2>
          {recursos.map(r => (
            <div key={r.id} className="p-4 border rounded-lg mb-2">
              <FileText className="inline w-5 h-5 text-orange-600 mr-2" />
              {r.tipo.toUpperCase()}: {r.titulo}
            </div>
          ))}
        </div>

        {/* Lista de entregas */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Entregas de Estudiantes</h2>
          {entregas.map(e => (
            <div key={e.id} className="p-4 border rounded-lg mb-2 flex justify-between">
              <div>
                <p className="font-semibold">{e.estudiante}</p>
                <p>{e.titulo} ({e.tipo})</p>
                <p>Archivo: {e.archivo}</p>
                {e.nota ? (
                  <p className="text-green-600">Nota: {e.nota}/10 – {e.feedback}</p>
                ) : (
                  <p className="text-orange-600">Sin calificar</p>
                )}
              </div>
              <button
                onClick={() => setSelectedEntrega(e)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {e.nota ? "Ver Detalles" : "Calificar"}
              </button>
            </div>
          ))}
        </div>

        {/* Panel de calificación */}
        {selectedEntrega && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Calificar Entrega</h2>
            <p>Estudiante: {selectedEntrega.estudiante}</p>
            <p>Recurso: {selectedEntrega.titulo}</p>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Nota"
              className="border p-2 w-full mb-2 rounded-lg"
            />
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Retroalimentación"
              className="border p-2 w-full mb-2 rounded-lg"
            />
            <button onClick={handleCalificar} className="px-4 py-2 bg-green-600 text-white rounded-lg">
              Guardar Calificación
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
