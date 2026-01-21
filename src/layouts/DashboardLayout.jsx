import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
  const location = useLocation();
  
  // Función para pintar de azul el botón activo
  const isActive = (path) => location.pathname === path 
    ? 'bg-blue-600 text-white' 
    : 'text-slate-300 hover:bg-slate-800';

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* BARRA LATERAL FIJA */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-sm font-black tracking-[0.2em] text-white/90 uppercase">
            Dreams Criteria
          </h1>
          <p className="text-[10px] text-white/40 font-bold mt-1 tracking-wider uppercase">
            Management System
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-4">
          <Link to="/" className={`block w-full text-left p-3 rounded-lg transition-colors ${isActive('/')}`}>
            1. Edición
          </Link>
          
          <Link to="/consulta" className={`block w-full text-left p-3 rounded-lg transition-colors ${isActive('/consulta')}`}>
            2. Consulta
          </Link>

          <Link to="/configuracion" className={`block w-full text-left p-3 rounded-lg transition-colors ${isActive('/configuracion')}`}>
            3. Configuración
          </Link>
        </nav>
      </aside>

      {/* AQUÍ SE CARGAN LAS PÁGINAS (Edicion, Consulta, etc) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-medium text-gray-700 capitalize">Gestión de Procesos</h2>
          <div className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Admin VIP</div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          <Outlet /> 
        </section>
      </main>
    </div>
  );
}