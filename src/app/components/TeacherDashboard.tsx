import { useState } from 'react';
import { LogOut, BookOpen, FileText, Eye, Star, MessageSquare, Users, CheckCircle, Clock, X } from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
}

interface Submission {
  id: number;
  studentName: string;
  assignmentTitle: string;
  submittedDate: string;
  status: 'sin calificar' | 'calificado';
  grade?: number;
  feedback?: string;
  fileUrl?: string;
}

export default function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [activeView, setActiveView] = useState<'main' | 'submissions' | 'review'>('main');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      studentName: 'María García',
      assignmentTitle: 'Taller de Matemáticas - Fracciones',
      submittedDate: '2026-06-05',
      status: 'calificado',
      grade: 9.5,
      feedback: 'Excelente trabajo, muy completo',
      fileUrl: 'taller_maria.pdf'
    },
    {
      id: 2,
      studentName: 'Juan Pérez',
      assignmentTitle: 'Taller de Ciencias - El Agua',
      submittedDate: '2026-06-07',
      status: 'calificado',
      grade: 8.0,
      feedback: 'Bien hecho, mejorar la presentación',
      fileUrl: 'taller_juan.pdf'
    },
    {
      id: 3,
      studentName: 'Ana Rodríguez',
      assignmentTitle: 'Taller de Español - Comprensión Lectora',
      submittedDate: '2026-06-08',
      status: 'sin calificar',
      fileUrl: 'taller_ana.pdf'
    },
    {
      id: 4,
      studentName: 'Carlos Martínez',
      assignmentTitle: 'Taller de Matemáticas - Fracciones',
      submittedDate: '2026-06-08',
      status: 'sin calificar',
      fileUrl: 'taller_carlos.pdf'
    }
  ]);

  const students = [
    { name: 'María García', submitted: true },
    { name: 'Juan Pérez', submitted: true },
    { name: 'Ana Rodríguez', submitted: true },
    { name: 'Carlos Martínez', submitted: true },
    { name: 'Laura Sánchez', submitted: false },
    { name: 'Pedro López', submitted: false },
  ];

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.grade?.toString() || '');
    setFeedbackInput(submission.feedback || '');
    setActiveView('review');
  };

  const handleGradeSubmit = () => {
    if (selectedSubmission && gradeInput && feedbackInput) {
      setSubmissions(submissions.map(sub =>
        sub.id === selectedSubmission.id
          ? { ...sub, status: 'calificado', grade: parseFloat(gradeInput), feedback: feedbackInput }
          : sub
      ));
      alert('Calificación guardada exitosamente');
      setActiveView('submissions');
      setSelectedSubmission(null);
      setGradeInput('');
      setFeedbackInput('');
    }
  };

  if (activeView === 'review' && selectedSubmission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setActiveView('submissions')}
            className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <X className="w-5 h-5" />
            Volver
          </button>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Vista previa del archivo */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-800">Vista Previa</h3>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-8 bg-gray-50 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Archivo: {selectedSubmission.fileUrl}</p>
                  <p className="text-sm text-gray-500">Vista previa del documento sin descargar</p>
                  <div className="mt-6 p-4 bg-white rounded-lg border-2 border-gray-300">
                    <p className="text-sm text-gray-700 mb-2">Contenido del taller...</p>
                    <p className="text-sm text-gray-500">
                      [Aquí se mostraría el contenido real del archivo PDF o documento]
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700"><strong>Estudiante:</strong> {selectedSubmission.studentName}</p>
                <p className="text-sm text-gray-700"><strong>Taller:</strong> {selectedSubmission.assignmentTitle}</p>
                <p className="text-sm text-gray-700"><strong>Fecha:</strong> {selectedSubmission.submittedDate}</p>
              </div>
            </div>

            {/* Panel de calificación */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-800">Calificar y Retroalimentar</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium">
                    Calificación (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    placeholder="Ej: 9.5"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 font-medium">
                    Retroalimentación
                  </label>
                  <textarea
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Escribe comentarios constructivos para el estudiante..."
                    rows={8}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none resize-none bg-white"
                  />
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Tip:</strong> Una buena retroalimentación incluye aspectos positivos y áreas de mejora específicas.
                  </p>
                </div>

                <button
                  onClick={handleGradeSubmit}
                  disabled={!gradeInput || !feedbackInput}
                  className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Guardar Calificación
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'submissions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setActiveView('main')}
            className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700"
          >
            <X className="w-5 h-5" />
            Volver
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Lista de Entregas</h2>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                  {submissions.filter(s => s.status === 'sin calificar').length} sin calificar
                </span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  {submissions.filter(s => s.status === 'calificado').length} calificados
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{submission.studentName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{submission.assignmentTitle}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Entregado: {submission.submittedDate}</span>
                        {submission.status === 'calificado' ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Calificado: {submission.grade}/10
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-orange-500 font-medium">
                            <Clock className="w-4 h-4" />
                            Sin calificar
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewSubmission(submission)}
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {submission.status === 'calificado' ? 'Ver Detalles' : 'Calificar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Panel - Resumen de entregas */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Panel de Control - Estado de Entregas</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {students.map((student, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                    student.submitted
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <span className="font-medium text-gray-800">{student.name}</span>
                  {student.submitted ? (
                    <span className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Entregó
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-700 text-sm font-medium">
                      <Clock className="w-5 h-5" />
                      No entregó
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-orange-600">Ronditas EduTech</h1>
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Panel del Maestro</h2>
          <p className="text-gray-600">Gestiona las entregas y calificaciones de tus estudiantes</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Ver Entregas */}
          <button
            onClick={() => setActiveView('submissions')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left border-2 border-transparent hover:border-orange-300 group"
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
              <FileText className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Lista de Entregas</h3>
            <p className="text-gray-600 mb-4">Revisa y califica los trabajos de tus estudiantes</p>
            <div className="flex gap-3 text-sm">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                {submissions.filter(s => s.status === 'sin calificar').length} nuevos
              </span>
            </div>
          </button>

          {/* Panel de Control */}
          <button
            onClick={() => setActiveView('submissions')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-left border-2 border-transparent hover:border-blue-300 group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <Users className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Panel de Control</h3>
            <p className="text-gray-600 mb-4">Visualiza quién entregó y quién no</p>
            <div className="flex gap-3 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {students.filter(s => s.submitted).length} entregados
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                {students.filter(s => !s.submitted).length} pendientes
              </span>
            </div>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-orange-100 mb-1">Total Entregas</p>
            <p className="text-4xl font-bold">{submissions.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 mb-1">Sin Calificar</p>
            <p className="text-4xl font-bold">{submissions.filter(s => s.status === 'sin calificar').length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-green-100 mb-1">Calificados</p>
            <p className="text-4xl font-bold">{submissions.filter(s => s.status === 'calificado').length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-purple-100 mb-1">Estudiantes</p>
            <p className="text-4xl font-bold">{students.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-left">
              <MessageSquare className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Enviar Mensaje Grupal</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Crear Nuevo Taller</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
              <Star className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-800">Ver Estadísticas</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
