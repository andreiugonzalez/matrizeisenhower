import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Save, Users, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const QuadrantConfig = {
  do: { title: 'Hacer Ahora', desc: 'Urgente e Importante', color: 'from-emerald-500 to-green-600', borderColor: 'border-emerald-500/30', info: 'Tareas que requieren tu atención inmediata. Hazlas tú mismo y cuanto antes.\nEjemplos: Crisis, fechas límite inminentes, emergencias.' },
  schedule: { title: 'Programar', desc: 'Importante, NO Urgente', color: 'from-blue-500 to-indigo-600', borderColor: 'border-blue-500/30', info: 'Tareas que te ayudan a lograr tus objetivos a largo plazo pero no tienen una fecha límite estricta hoy. Decide cuándo las harás.\nEjemplos: Planificación, ejercicio, estudios.' },
  delegate: { title: 'Delegar', desc: 'Urgente, NO Importante', color: 'from-amber-500 to-orange-600', borderColor: 'border-amber-500/30', info: 'Tareas que tienen que hacerse pronto pero no requieren tu habilidad específica. Encuentra a quién asignárselas.\nEjemplos: Llamadas de rutina, tareas administrativas menores, enviar correos repetitivos.' },
  delete: { title: 'Eliminar', desc: 'Ni Urgente ni Importante', color: 'from-rose-500 to-red-600', borderColor: 'border-rose-500/30', info: 'Distracciones que no aportan valor a tus objetivos. Bórralas o minimízalas.\nEjemplos: Exceso de redes sociales, tareas para complacer a otros, ver televisión en exceso.' }
};

export default function MatrixEditor({ userName, onSaved, onGoToWall, onBackToLogin }) {
  const [quadrants, setQuadrants] = useState({
    do: [''],
    schedule: [''],
    delegate: [''],
    delete: ['']
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);

  const handleTaskChange = (quadrant, index, value) => {
    setQuadrants(prev => {
      const updated = [...prev[quadrant]];
      updated[index] = value;
      return { ...prev, [quadrant]: updated };
    });
    setError('');
  };

  const addTask = (quadrant) => {
    if (quadrants[quadrant].length < 4) {
      setQuadrants(prev => ({ ...prev, [quadrant]: [...prev[quadrant], ''] }));
    }
  };

  const removeTask = (quadrant, index) => {
    if (quadrants[quadrant].length > 1) {
      setQuadrants(prev => {
        const updated = [...prev[quadrant]];
        updated.splice(index, 1);
        return { ...prev, [quadrant]: updated };
      });
    }
  };

  const validate = () => {
    // Revisamos que todos los campos tengan texto
    for (const key of Object.keys(quadrants)) {
      const items = quadrants[key];
      if (items.some(t => t.trim() === '')) {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) {
      setError('Por favor, completa todas las tareas vacías antes de guardar.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await addDoc(collection(db, 'matrices'), {
        nombreParticipante: userName,
        cuadranteHacer: quadrants.do.filter(t => t.trim() !== ''),
        cuadranteProgramar: quadrants.schedule.filter(t => t.trim() !== ''),
        cuadranteDelegar: quadrants.delegate.filter(t => t.trim() !== ''),
        cuadranteEliminar: quadrants.delete.filter(t => t.trim() !== ''),
        createdAt: serverTimestamp()
      });
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        onSaved();
      }, 2000);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError('Error al conectar con la base de datos: ' + err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Tu Matriz, <span className="text-indigo-400">{userName}</span></h1>
          <p className="text-zinc-400"></p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-medium text-sm"
            title="Cambiar mi nombre"
          >
            Atrás
          </button>
          <button
            onClick={onGoToWall}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all font-medium"
          >
            <Users className="w-5 h-5" />
            Ver Muro Público
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 mx-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto w-full">
        {Object.entries(QuadrantConfig).map(([key, config], idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel rounded-2xl p-6 flex flex-col border-t-4 ${config.borderColor}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${config.color}`}>
                    {config.title}
                  </h2>
                  <button onClick={() => setActiveInfo(key)} className="text-zinc-500 hover:text-white transition-colors" title="¿Qué significa esto?">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-zinc-400 text-sm mt-1">{config.desc}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {quadrants[key].map((task, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-sm w-5">{i + 1}.</span>
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => handleTaskChange(key, i, e.target.value)}
                    placeholder="Escribe la tarea..."
                    className="flex-1 bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
                  />
                  {quadrants[key].length > 1 && (
                    <button
                      onClick={() => removeTask(key, i)}
                      className="p-2 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {quadrants[key].length < 4 && (
              <button
                onClick={() => addTask(key)}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Agregar otra tarea
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center pb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-6 h-6" />
          )}
          {isSaving ? 'Guardando...' : 'Guardar y Publicar en el Muro'}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-emerald-500/30 p-8 rounded-2xl flex flex-col items-center shadow-2xl max-w-sm text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Guardado Correctamente!</h2>
              <p className="text-zinc-400 text-sm">Tus prioridades han sido publicadas en el muro. Redirigiendo...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`bg-zinc-900 border-t-4 ${QuadrantConfig[activeInfo].borderColor} p-6 sm:p-8 rounded-2xl flex flex-col shadow-2xl max-w-md w-full relative`}
            >
              <button
                onClick={() => setActiveInfo(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <Info className="w-8 h-8 text-white" />
                <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${QuadrantConfig[activeInfo].color}`}>
                  {QuadrantConfig[activeInfo].title}
                </h2>
              </div>
              <p className="text-zinc-300 whitespace-pre-line text-lg leading-relaxed mb-6">
                {QuadrantConfig[activeInfo].info}
              </p>
              <button
                onClick={() => setActiveInfo(null)}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
