import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Edicion() {
  const [nombreProceso, setNombreProceso] = useState('');
  const [bloque, setBloque] = useState('1');
  const [nivel, setNivel] = useState('N0');
  
  // CORRECCIÓN AQUÍ: Usamos () => [...] para que Date.now() solo se ejecute una vez
  const [pasos, setPasos] = useState(() => [
    { id: Date.now(), texto: '', instruccion: '', tipo: 'proceso' }
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
        pasos,
        fechaCreacion: new Date()
      });
      alert(`✅ Guardado con éxito: ${codigoSugerido}`);
      // Opcional: Limpiar formulario
      setNombreProceso('');
      setPasos([{ id: Date.now(), texto: '', tipo: 'proceso' }]);
    } catch (error) {
      console.error("Error al guardar: ", error);
      alert("❌ Error al guardar");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-slate-800 mb-2">Nuevo Proceso</h1>
      <p className="text-slate-500 mb-8">Registre la estructura básica del proceso.</p>

      <form onSubmit={guardarTodo} className="space-y-6">
        {/* TARJETA 1: DATOS GENERALES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Input Nombre */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre del Proceso</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ej. Ventas Mostrador"
                value={nombreProceso}
                onChange={(e) => setNombreProceso(e.target.value)}
              />
            </div>

            {/* Código Preview */}
            <div className="bg-slate-900 rounded-xl p-4 text-center flex flex-col justify-center">
              <span className="text-slate-400 text-xs font-bold uppercase">Código Generado</span>
              <span className="text-2xl font-mono text-blue-400 font-bold tracking-wider mt-1">
                {codigoSugerido}
              </span>
            </div>

            {/* Selectores */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bloque</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-700"
                value={bloque}
                onChange={(e) => setBloque(e.target.value)}
              >
                <option value="1">Bloque 1</option>
                <option value="2">Bloque 2</option>
                <option value="3">Bloque 3</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nivel</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-700"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
              >
                <option value="N0">N0 (Macro)</option>
                <option value="N1">N1 (Sub)</option>
                <option value="N2">N2 (Operativo)</option>
                <option value="N3">N3 (Instrucción)</option>
              </select>
            </div>
          </div>
        </div>

        {/* TARJETA 2: FLUJO DE ACTIVIDADES */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">⚡</span>
            Secuencia de Actividades
          </h2>

          <div className="space-y-3">
            {pasos.map((paso, index) => (
              <div key={paso.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                
                {/* CABECERA DEL PASO */}
                <div className="flex gap-4 items-center mb-3">
                  <span className="font-mono text-slate-400 font-bold text-xl">#{index + 1}</span>
                  <input 
                    className="flex-1 bg-white border border-slate-200 rounded-lg p-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    value={paso.texto}
                    onChange={(e) => actualizarPaso(paso.id, 'texto', e.target.value)}
                    placeholder="Nombre corto de la actividad (Ej. Recibir Factura)"
                  />
                  <select 
                    className="p-3 rounded-lg bg-white font-bold text-xs uppercase border border-slate-200 cursor-pointer"
                    value={paso.tipo}
                    onChange={(e) => actualizarPaso(paso.id, 'tipo', e.target.value)}
                  >
                    <option value="proceso">Acción ▢</option>
                    <option value="decision">Decisión ◇</option>
                  </select>
                </div>

                {/* CAMPO DE INSTRUCCIÓN DETALLADA (NUEVO) */}
                <div className="pl-10">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Instrucción de Trabajo</label>
                  <textarea
                    className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-600 outline-none focus:border-blue-400 min-h-20"
                    placeholder="Describa detalladamente cómo se realiza esta actividad..."
                    value={paso.instruccion || ''}
                    onChange={(e) => actualizarPaso(paso.id, 'instruccion', e.target.value)}
                  />
                </div>

              </div>
            ))}
          </div>
          <button 
            type="button" 
            onClick={agregarPaso}
            className="mt-6 w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:text-blue-500 hover:border-blue-500 transition-all"
          >
            + Añadir Siguiente Actividad
          </button>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-800 transition-transform active:scale-95">
          GUARDAR PROCESO
        </button>
      </form>
    </div>
  );
}