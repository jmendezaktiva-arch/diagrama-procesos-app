import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Para movernos de página

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Si el login es correcto, nos manda al Dashboard
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o usuario no encontrado');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">DC Platform</h1>
          <p className="text-slate-500 text-sm mt-2">Ingresa a tu consola de gestión</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 font-bold outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 font-bold outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
          >
            INICIAR SESIÓN
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-slate-400">
          Dreams Criteria © 2026
        </p>
      </div>
    </div>
  );
}