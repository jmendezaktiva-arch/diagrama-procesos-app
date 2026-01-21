import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  // 1. Mientras verifica con Google, mostramos "Cargando..."
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Cargando sistema...
      </div>
    );
  }

  // 2. Si NO hay usuario, lo mandamos al Login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 3. Si SÍ hay usuario, le mostramos la app (los hijos)
  return children;
}