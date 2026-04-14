import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, LayoutGrid } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const QuadrantTitles = {
  do: 'Hacer',
  schedule: 'Programar',
  delegate: 'Delegar',
  delete: 'Eliminar'
};

const DBKeys = {
  do: 'cuadranteHacer',
  schedule: 'cuadranteProgramar',
  delegate: 'cuadranteDelegar',
  delete: 'cuadranteEliminar'
};

const QuadrantColors = {
  do: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  schedule: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  delegate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  delete: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

export default function PublicWall({ userName, onBackToEditor }) {
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'matrices'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setMatrices(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching matrices:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3 text-white mb-2">
            <LayoutGrid className="text-indigo-400" />
            Muro Público
          </h1>
          <p className="text-zinc-400">Revisa las respuestas de otros participantes en tiempo real.</p>
        </div>
        <button 
          onClick={onBackToEditor}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a mi Matriz
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p>Sincronizando con el servidor...</p>
        </div>
      ) : matrices.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl max-w-2xl mx-auto">
          <Clock className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">Aún no hay matrices publicadas</h3>
          <p className="text-zinc-400">Sé el primero en guardar y publicar la tuya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {matrices.map((matrix, idx) => (
              <motion.div
                key={matrix.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`glass-panel rounded-2xl p-6 relative overflow-hidden ${(matrix.nombreParticipante || matrix.userName) === userName ? 'ring-2 ring-indigo-500' : ''}`}
              >
                {(matrix.nombreParticipante || matrix.userName) === userName && (
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Tú
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm">
                    {(matrix.nombreParticipante || matrix.userName || '?').charAt(0).toUpperCase()}
                  </span>
                  {matrix.nombreParticipante || matrix.userName}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {['do', 'schedule', 'delegate', 'delete'].map(quadrant => {
                    const tasks = matrix[DBKeys[quadrant]] || (matrix.quadrants ? matrix.quadrants[quadrant] : []);
                    return (
                    <div key={quadrant} className={`p-3 rounded-xl border ${QuadrantColors[quadrant]}`}>
                      <h4 className="text-xs font-bold uppercase mb-2 opacity-80">{QuadrantTitles[quadrant]}</h4>
                      <ul className="space-y-1">
                        {tasks.map((task, i) => (
                          <li key={i} className="text-sm truncate" title={task}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  )})}
                </div>
                
                <div className="mt-4 text-right text-xs text-zinc-500">
                  {matrix.createdAt.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
