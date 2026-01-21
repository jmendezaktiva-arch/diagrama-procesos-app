import React, { useState } from 'react';
// Importamos la conexión a la base de datos y las funciones de Google
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Configuracion() {
  // Estados para capturar lo que escribes
  const [nombreEmpresa, setNombreEmpresa] = useState("Mi Empresa");
  const [colorPrimario, setColorPrimario] = useState("#2563eb");
  const [cargando, setCargando] = useState(false);

  const rolesDefinidos = [
    { id: 'vip', nombre: 'Admin VIP', desc: 'Control total del sistema' },
    { id: 'claseb', nombre: 'Admin Clase B', desc: 'Edición y consulta general' },
    { id: 'n1', nombre: 'Nivel 1: Direcciones', desc: 'Consulta de macroprocesos' },
    { id: 'n2', nombre: 'Nivel 2: Mandos Medios', desc: 'Gestión operativa' },
    { id: 'n3', nombre: 'Nivel 3: Operativos', desc: 'Consulta de instrucciones' },
  ];

  // FUNCIÓN PARA GUARDAR EN FIREBASE
  const guardarConfiguracion = async () => {
    setCargando(true);
    try {
      // Guardamos en la carpeta 'configuracion', documento 'identidad'
      await setDoc(doc(db, "configuracion", "identidad"), {
        nombre: nombreEmpresa,
        color: colorPrimario,
        ultimaActualizacion: new Date()
      });
      alert("✅ Configuración guardada en la Nube");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al guardar");
    }
    setCargando(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-800">Ajustes del Sistema</h1>
        <p className="text-slate-500">Personaliza la identidad y revisa los niveles de acceso.</p>
      </header>

      {/* Identidad Corporativa */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-slate-700 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">🏢</span>
          Identidad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Nombre de la Empresa</label>
            <input 
              type="text" 
              value={nombreEmpresa}
              onChange={(e) => setNombreEmpresa(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Color Institucional</label>
            <input 
              type="color" 
              value={colorPrimario}
              onChange={(e) => setColorPrimario(e.target.value)}
              className="w-full h-14 p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer" 
            />
          </div>
        </div>
      </section>

      {/* Matriz de Roles (Visual) */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-slate-700 flex items-center">
          <span className="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3">👥</span>
          Matriz de Roles y Accesos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesDefinidos.map((rol) => (
            <div key={rol.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-50 transition-colors">
              <p className="font-bold text-slate-800">{rol.nombre}</p>
              <p className="text-xs text-slate-500 mt-1">{rol.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button 
          onClick={guardarConfiguracion}
          disabled={cargando}
          className={`${cargando ? 'bg-slate-400' : 'bg-slate-900 hover:bg-blue-600'} text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg`}
        >
          {cargando ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}