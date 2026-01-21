/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Edicion() {
  const [nombreProceso, setNombreProceso] = useState('');
  const [bloque, setBloque] = useState('1');
  const [nivel, setNivel] = useState('N0');
  
  // Agregamos Responsable e Icono por defecto en cada paso
  const [pasos, setPasos] = useState(() => [
    { id: Date.now(), texto: '', instruccion: '', tipo: 'proceso', responsable: '', icono: '⚙️' }
  ]);

  // CÁLCULO DE ESTADO DERIVADO
  const codigoSugerido = `B${bloque}-${nivel}-${nombreProceso.substring(0, 3).toUpperCase() || 'XXX'}`;

  const agregarPaso = () => {
    // Aquí Date.now() sí es válido porque se ejecuta al hacer click, no al renderizar
    setPasos([...pasos, { id: Date.now(), texto: '', tipo: 'proceso' }]);
  };

  const actualizarPaso = (id, campo, valor) => {
    setPasos(pasos.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  const guardarTodo = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "procesos"), {
        codigo: codigoSugerido,
        nombre: nombreProceso,
        bloque,
        nivel,
        pasos, // Incluye los nuevos campos: responsable e icono
        fechaCreacion: new Date()
      });

      // Feedback profesional al usuario
      alert(`✅ Proceso Maestro [${codigoSugerido}] guardado con éxito en Dreams Criteria`);
      
      // RESTAURADO: Limpieza del formulario respetando el nuevo esquema premium
      setNombreProceso('');
      setPasos([
        { id: Date.now(), texto: '', instruccion: '', tipo: 'proceso', responsable: '', icono: '⚙️' }
      ]);

    } catch (error) {
      console.error("Error al guardar:", error);
      // RESTAURADO: Notificación de error al usuario
      alert("❌ Error al guardar el proceso en la base de datos. Por favor, verifique su conexión.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-slate-50 min-h-screen">
      <form onSubmit={guardarTodo} className="space-y-8 pb-24">
        
        {/* CABECERA DE CONFIGURACIÓN: RESTAURADA Y MEJORADA */}
        <div className="bg-dreams-blue p-8 rounded-[2.5rem] text-white shadow-premium relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black tracking-tight mb-6 text-white/90">Configurador de Procesos</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* 1. Nombre (Original restaurado) */}
              <div className="md:col-span-1 space-y-2">
                <label className="text-label-premium text-white/60">Nombre del Proceso</label>
                <input 
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 outline-none focus:bg-white/20 transition-all text-white placeholder:text-white/30"
                  value={nombreProceso}
                  onChange={(e) => setNombreProceso(e.target.value)}
                  placeholder="Ej. Reclutamiento"
                />
              </div>

              {/* 2. Bloque (RESTAURADO) */}
              <div className="space-y-2">
                <label className="text-label-premium text-white/60">Bloque de Negocio</label>
                <select 
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 outline-none focus:bg-white/20 text-white cursor-pointer"
                  value={bloque}
                  onChange={(e) => setBloque(e.target.value)}
                >
                  <option value="1" className="text-slate-900">Bloque 1</option>
                  <option value="2" className="text-slate-900">Bloque 2</option>
                  <option value="3" className="text-slate-900">Bloque 3</option>
                </select>
              </div>

              {/* 3. Nivel (Original restaurado) */}
              <div className="space-y-2">
                <label className="text-label-premium text-white/60">Nivel Jerárquico</label>
                <select 
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 outline-none focus:bg-white/20 text-white cursor-pointer"
                  value={nivel} onChange={(e) => setNivel(e.target.value)}
                >
                  <option value="N0" className="text-slate-900">Nivel 0: Estratégico</option>
                  <option value="N1" className="text-slate-900">Nivel 1: Táctico</option>
                  <option value="N2" className="text-slate-900">Nivel 2: Operativo</option>
                </select>
              </div>

              {/* 4. Código (Previsualización Premium) */}
              <div className="space-y-2 text-center">
                <label className="text-label-premium text-white/60">Código ID</label>
                <div className="p-3 bg-dreams-gold rounded-xl font-black text-white shadow-lg border border-white/20">
                  {codigoSugerido}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LISTADO DE ACTIVIDADES: FUSIÓN DE REGLAS ORIGINALES Y LOOK PREMIUM */}
        <div className="space-y-6">
          <h2 className="text-label-premium text-slate-400">Secuencia de Actividades Maestras</h2>
          
          {pasos.map((paso, index) => (
            <div key={paso.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-premium transition-all group">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Lado Izquierdo: Icono y Tipo */}
                <div className="lg:w-1/4 space-y-4">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Actividad #{index + 1}</span>
                  <div className="flex gap-2">
                    <select 
                      className="bg-slate-100 p-2 rounded-lg text-lg cursor-pointer hover:bg-slate-200 transition-colors"
                      value={paso.icono} onChange={(e) => actualizarPaso(paso.id, 'icono', e.target.value)}
                    >
                      <option value="⚙️">⚙️ Proceso</option>
                      <option value="📝">📝 Registro</option>
                      <option value="📧">📧 Email</option>
                      <option value="🔍">🔍 Revisión</option>
                      <option value="✅">✅ Aprobación</option>
                      <option value="🚀">🚀 Lanzamiento</option>
                    </select>
                    <select 
                      className="flex-1 bg-slate-900 text-white p-2 rounded-lg text-[10px] font-black uppercase tracking-tighter cursor-pointer"
                      value={paso.tipo} onChange={(e) => actualizarPaso(paso.id, 'tipo', e.target.value)}
                    >
                      <option value="proceso">Acción ▢</option>
                      <option value="decision">Validación ◇</option>
                    </select>
                  </div>
                </div>

                {/* Centro: Texto y Responsable (Trazabilidad asegurada) */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">¿Qué se hace?</label>
                      <input 
                        className="w-full text-lg font-bold text-slate-800 border-b-2 border-slate-100 focus:border-dreams-gold outline-none pb-1 bg-transparent"
                        placeholder="Título de la tarea..."
                        value={paso.texto} onChange={(e) => actualizarPaso(paso.id, 'texto', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">¿Quién lo hace?</label>
                      <input 
                        className="w-full text-sm font-medium text-slate-500 border-b-2 border-slate-100 focus:border-slate-300 outline-none pb-1 bg-transparent italic"
                        placeholder="Cargo o Responsable..."
                        value={paso.responsable} onChange={(e) => actualizarPaso(paso.id, 'responsable', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Instrucción (Regla original mantenida) */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Instrucción Detallada (Know-How)</label>
                    <textarea 
                      className="w-full bg-slate-50 rounded-xl p-4 text-sm text-slate-600 outline-none focus:ring-1 focus:ring-slate-200 min-h-[80px]"
                      placeholder="Escriba el paso a paso de esta actividad..."
                      value={paso.instruccion || ''} 
                      onChange={(e) => actualizarPaso(paso.id, 'instruccion', e.target.value)}
                    />
                  </div>
                </div>

                {/* Derecha: Acción Eliminar */}
                <button 
                  type="button"
                  onClick={() => setPasos(pasos.filter(p => p.id !== paso.id))}
                  className="text-slate-300 hover:text-red-500 transition-colors self-start p-2"
                  title="Eliminar actividad"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Añadir (Original mejorado) */}
        <button 
          type="button" 
          onClick={agregarPaso}
          className="w-full py-6 border-2 border-dashed border-slate-300 rounded-[2.5rem] text-slate-400 font-black text-sm uppercase tracking-widest hover:bg-white hover:border-dreams-gold hover:text-dreams-gold transition-all group"
        >
          <span className="group-hover:scale-125 transition-transform inline-block mr-2">+</span> 
          Añadir Siguiente Actividad
        </button>

        {/* Botón Guardar (Restaurado y fijado) */}
        <button 
          type="submit" 
          className="fixed bottom-8 right-8 bg-dreams-gold text-white px-12 py-5 rounded-full font-black text-lg shadow-premium hover:scale-105 active:scale-95 transition-all z-50 border border-white/20"
        >
          GUARDAR SISTEMA MAESTRO
        </button>
      </form>
    </div>
  );
}