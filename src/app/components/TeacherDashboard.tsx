import { useState, useEffect } from "react";
import { LogOut, FileText, ClipboardList, GraduationCap, UploadCloud } from "lucide-react";

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

interface Pregunta {
  texto: string;
  respuestas: string[];
}

export default function TeacherDashboard({ onLogout, profesor }: TeacherDashboardProps) {
  const [periodo, setPeriodo] = useState(2);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [tituloExamen, setTituloExamen] = useState("");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([{ texto: "", respuestas: ["", "", "", ""] }]);
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

  const handleCrearTaller = async () => {
    await fetch("http://localhost:3001/recursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descripcion, fecha_limite: fechaLimite, comentarios, tipo: "taller", periodo, creado_por: profesor }),
    });
    alert(`Taller creado: ${titulo}`);
    setTitulo(""); setDescripcion(""); setFechaLimite(""); setComentarios("");
  };

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { texto: "", respuestas: ["", "", "", ""] }]);
  };

  const actualizarPregunta = (idx: number, texto: string) => {
    const nuevas = [...preguntas];
    nuevas[idx].texto = texto;
    setPreguntas(nuevas);
  };

  const actualizarRespuesta = (idx: number, i: number, texto: string) => {
    const nuevas = [...preguntas];
    nuevas[idx].respuestas[i] = texto;
    setPreguntas(nuevas);
  };

  const handleCrearExamen = async () => {
    await fetch("http://localhost:3001/recursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: tituloExamen, tipo: "examen", periodo, creado_por: profesor, preguntas }),
    });
    alert(`Examen creado: ${tituloExamen}`);
    setTituloExamen(""); setPreguntas([{ texto: "", respuestas: ["", "", "", ""] }]);
  };

  const handleCalificar = async () => {
    if (selectedEntrega) {
      await fetch(`http://localhost:3001/entregas/${selectedEntrega.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota: parseFloat(nota), feedback }),
      });
      alert("Calificación guardada");
      setNota(""); setFeedback(""); setSelectedEntrega(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50">
      <header className="bg-orange-600 shadow-md p-4 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="w-7 h-7" /> Panel del Maestro – Periodo {periodo}
        </h1>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-100">
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Selector de periodo */}
        <div className="flex gap-4 justify-center">
          {[1, 2, 3].map(p => (
            <button key={p} onClick={() => setPeriodo(p)} className={`px-6 py-2 rounded-full font-semibold shadow-md ${periodo === p ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700"}`}>
              Periodo {p}
            </button>
          ))}
        </div>

        {/* Crear Taller */}
        <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-orange-600">
          <h2 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2"><ClipboardList /> Crear Taller</h2>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" className="border p-2 w-full mb-2 rounded-lg" />
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" className="border p-2 w-full mb-2 rounded-lg" />
          <input type="date" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} className="border p-2 w-full mb-2 rounded-lg" />
          <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} placeholder="Comentarios iniciales" className="border p-2 w-full mb-2 rounded-lg" />
          <button onClick={handleCrearTaller} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Crear Taller</button>
        </div>

        {/* Crear Examen */}
        <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center gap-2"><FileText /> Crear Examen</h2>
          <input value={tituloExamen} onChange={(e) => setTituloExamen(e.target.value)} placeholder="Título del examen" className="border p-2 w-full mb-2 rounded-lg" />
          {preguntas.map((p, idx) => (
            <div key={idx} className="mb-4 border p-4 rounded-lg bg-gray-50">
              <input value={p.texto} onChange={(e) => actualizarPregunta(idx, e.target.value)} placeholder={`Pregunta ${idx + 1}`} className="border p-2 w-full mb-2 rounded-lg" />
              {p.respuestas.map((r, i) => (
                <input key={i} value={r} onChange={(e) => actualizarRespuesta(idx, i, e.target.value)} placeholder={`Respuesta ${i + 1}`} className="border p-2 w-full mb-2 rounded-lg" />
              ))}
            </div>
          ))}
          <button onClick={agregarPregunta} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Agregar Pregunta</button>
          <button onClick={handleCrearExamen} className="px-4 py-2 bg-green-600 text-white rounded-lg ml-2">Guardar Examen</button>
        </div>

        {/* Lista de entregas */}
        <div className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-600">
          <h2 className="text-xl font-bold mb-4 text-green-600">Entregas de Estudiantes</h2>
          {entregas.map(e => (
            <div key={e.id} className="p-4 border rounded-lg mb-2 flex justify-between bg-gray-50 hover:bg-gray-100">
              <div>
                <p className="font-semibold">{e.estudiante}</p>
                <p>{e.titulo} ({e.tipo})</p>
                <p>Archivo: {e.archivo}</p>
                {e.nota ? (
                  <p className="text-green-600 font-semibold">Nota: {e.nota}/10 – {e.feedback}</p>
                ) : (
                  <p className="text-orange-600 font-semibold">Sin calificar</p>
                )}
              </div>
              <button
                onClick={() => setSelectedEntrega(e)}
                className={`px-4 py-2 rounded-lg font-semibold shadow-md ${e.nota ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600"
                  } text-white`}
              >
                {e.nota ? "Ver Detalles" : "Calificar"}
              </button>
            </div>
          ))}
        </div>

        {/* Panel de calificación */}
        {selectedEntrega && (
          <div className="p-8 bg-gradient-to-r from-green-50 to-white rounded-xl shadow-lg border-l-4 border-green-600">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Calificar Entrega</h2>
            <div className="mb-4">
              <p className="text-lg font-semibold">👩‍🎓 Estudiante: <span className="text-gray-700">{selectedEntrega.estudiante}</span></p>
              <p className="text-lg">📘 Recurso: <span className="text-gray-700">{selectedEntrega.titulo} ({selectedEntrega.tipo})</span></p>
            </div>

            {/* Vista previa del archivo */}
            <div className="mb-6">
              <iframe
                src={`http://localhost:3001/uploads/${selectedEntrega.archivo}`}
                className="w-full h-96 border rounded-lg shadow-md"
                title="Vista previa de entrega"
              ></iframe>
            </div>

            {/* Nota */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nota (0–10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Ingrese la nota"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Retroalimentación */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Retroalimentación</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escriba comentarios para el estudiante"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              onClick={handleCalificar}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition"
            >
              ✅ Guardar Calificación
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
