import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel w-full max-w-md rounded-2xl p-8"
      >
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <User className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            Matriz de Eisenhower
          </h1>
          <p className="text-zinc-400">Identifícate para comenzar la dinámica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Tu Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ana García"
              autoFocus
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium grid place-items-center rounded-xl py-3 shadow-lg shadow-indigo-500/25 transition-all group"
          >
            <span className="flex items-center gap-2">
              Comenzar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
