import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoUcen from './assets/LogoUcen.png';
import Login from './components/Login';
import MatrixEditor from './components/MatrixEditor';
import PublicWall from './components/PublicWall';

function App() {
  const [userName, setUserName] = useState('');
  // view can be 'login', 'editor', 'wall'
  const [view, setView] = useState('login');

  const handleLogin = (name) => {
    setUserName(name);
    setView('editor');
  };

  const handleMatrixSaved = () => {
    setView('wall');
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-0" />
      
      <main className="relative z-10 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div 
              key="login" 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -30 }} 
              transition={{ duration: 0.4 }}
            >
              <Login onLogin={handleLogin} />
            </motion.div>
          )}
          {view === 'editor' && (
            <motion.div 
              key="editor" 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              transition={{ duration: 0.4 }}
            >
              <MatrixEditor userName={userName} onSaved={handleMatrixSaved} onGoToWall={() => setView('wall')} onBackToLogin={() => setView('login')} />
            </motion.div>
          )}
          {view === 'wall' && (
            <motion.div 
              key="wall" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 30 }} 
              transition={{ duration: 0.4 }}
            >
              <PublicWall userName={userName} onBackToEditor={() => setView('editor')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sello Universitario Fijo */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-300">
        <img 
          src={LogoUcen}
          alt="Sello Universitario" 
          className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
        />
      </div>
    </>
  );
}

export default App;
