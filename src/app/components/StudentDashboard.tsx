import { useState } from 'react';
import { Upload, FileQuestion, History, LogOut, BookOpen, CheckCircle, Clock, X } from 'lucide-react';

interface StudentDashboardProps {
  onLogout: () => void;
}

interface Assignment {
  id: number;
  title: string;
  date: string;
  status: 'entregado' | 'pendiente';
  grade?: number;
  feedback?: string;
}

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeView, setActiveView] = useState<'main' | 'upload' | 'quiz' | 'history'>('main');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assignments] = useState<Assignment[]>([
    { id: 1, title: 'Taller de Matemáticas - Fracciones', date: '2026-06-05', status: 'entregado', grade: 9.5, feedback: 'Excelente trabajo, muy completo' },
    { id: 2, title: 'Taller de Ciencias - El Agua', date: '2026-06-07', status: 'entregado', grade: 8.0, feedback: 'Bien hecho, mejorar la presentación' },
    { id: 3, title: 'Taller de Español - Comprensión Lectora', date: '2026-06-08', status: 'pendiente' },
  ]);

  const [quizAnswers, setQuizAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (selectedFile) {
      alert(`Taller "${selectedFile.name}" subido exitosamente`);
      setSelectedFile(null);
      setActiveView('main');
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswers.q1 && quizAnswers.q2 && quizAnswers.q3) {
      alert('Cuestionario enviado exitosamente');
      setQuizAnswers({ q1: '', q2: '', q3: '' });
      setActiveView('main');
    }
  };

  if (activeView === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setActiveView('main')}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <X className="w-5 h-5" />
            Volver
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Subir Taller</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Nombre del Taller</label>
                <input
                  type="text"
                  placeholder="Ejemplo: Taller de Matemáticas - Suma y Resta"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Descripción (opcional)</label>
                <textarea
                  placeholder="Agrega una descripción de tu trabajo"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none resize-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">Archivo del Taller</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">
                      {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un archivo'}
                    </p>
                    <p className="text-sm text-gray-400">PDF, Word, o Imagen (máx. 10MB)</p>
                  </label>
                </div>
              </div>

              <button
                onClick={handleUploadSubmit}
                disabled={!selectedFile}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium shadow-lg transition-all"
              >
                Subir Taller
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setActiveView('main')}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <X className="w-5 h-5" />
            Volver
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileQuestion className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Cuestionario: Ciencias Naturales</h2>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Instrucciones:</strong> Responde todas las preguntas con tus propias palabras.
                  Tienes 30 minutos para completar el cuestionario.
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">
                  1. ¿Cuáles son los tres estados del agua?
                </label>
                <textarea
                  value={quizAnswers.q1}
                  onChange={(e) => setQuizAnswers({...quizAnswers, q1: e.target.value})}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none resize-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">
                  2. Explica el ciclo del agua en tus propias palabras
                </label>
                <textarea
                  value={quizAnswers.q2}
                  onChange={(e) => setQuizAnswers({...quizAnswers, q2: e.target.value})}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none resize-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">
                  3. ¿Por qué es importante el agua para los seres vivos?
                </label>
                <textarea
                  value={quizAnswers.q3}
                  onChange={(e) => setQuizAnswers({...quizAnswers, q3: e.target.value})}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:outline-none resize-none bg-white"
                />
              </div>

              <button
                onClick={handleQuizSubmit}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transition-all"
              >
                Enviar Cuestionario
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setActiveView('main')}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <X className="w-5 h-5" />
            Volver
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Historial de Entregas</h2>
            </div>

            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-2">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">Fecha: {assignment.date}</p>

                      <div className="flex items-center gap-2">
                        {assignment.status === 'entregado' ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">Entregado</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-orange-500" />
                            <span className="text-sm text-orange-500 font-medium">Pendiente</span>
                          </>
                        )}
                      </div>

                      {assignment.grade && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            Calificación: {assignment.grade}/10
                          </p>
                          {assignment.feedback && (
                            <p className="text-sm text-green-700 mt-1">
                              <strong>Retroalimentación:</strong> {assignment.feedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">Ronditas EduTech</h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido, Estudiante!</h2>
          <p className="text-gray-600">Aquí puedes gestionar tus talleres y cuestionarios</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Subir Taller */}
          <button
            onClick={() => setActiveView('upload')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left border-2 border-transparent hover:border-blue-300 group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <Upload className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Subir Taller</h3>
            <p className="text-gray-600">Envía tus trabajos completados</p>
          </button>

          {/* Responder Cuestionario */}
          <button
            onClick={() => setActiveView('quiz')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left border-2 border-transparent hover:border-orange-300 group"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
              <FileQuestion className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Responder Cuestionario</h3>
            <p className="text-gray-600">Completa las evaluaciones disponibles</p>
          </button>

          {/* Historial */}
          <button
            onClick={() => setActiveView('history')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left border-2 border-transparent hover:border-blue-300 group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <History className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Historial de Entregas</h3>
            <p className="text-gray-600">Revisa tus trabajos anteriores</p>
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 mb-1">Talleres Entregados</p>
            <p className="text-4xl font-bold">2</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-orange-100 mb-1">Talleres Pendientes</p>
            <p className="text-4xl font-bold">1</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-green-100 mb-1">Promedio General</p>
            <p className="text-4xl font-bold">8.8</p>
          </div>
        </div>
      </main>
    </div>
  );
}
