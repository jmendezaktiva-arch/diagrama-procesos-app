import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import DiagramaAuto from '../components/DiagramaAuto'; 
import html2pdf from 'html2pdf.js'; 
export default function Consulta() {
  const [procesos, setProcesos] = useState([]);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
  const [pasoDetalle, setPasoDetalle] = useState(null);

  // Referencia al "Molde" del PDF (el contenido invisible)
  const printRef = useRef();

  useEffect(() => {
    const obtenerProcesos = async () => {
      const querySnapshot = await getDocs(collection(db, "procesos"));
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProcesos(lista);
    };
    obtenerProcesos();
  }, []);

  const alHacerClicEnNodo = (nodo) => {
    const pasoEncontrado = procesoSeleccionado.pasos.find(p => p.id.toString() === nodo.id);
    setPasoDetalle(pasoEncontrado);
  };

  // --- FUNCIÓN GENERADORA DE PDF ---
  const descargarManual = () => {
    const element = printRef.current; // Seleccionamos el molde invisible
    const opt = {
      margin:       0.5,
      filename:     `Manual-${procesoSeleccionado.codigo}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 }, // Mayor escala = Mejor calidad
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Visor de Flujos DC</h1>
          <p className="text-slate-500 text-sm">Consulta de procesos y diagramas automáticos.</p>
        </div>
        
        {/* BOTÓN DE DESCARGA (Solo aparece si hay proceso seleccionado) */}
        {procesoSeleccionado && (
          <button 
            onClick={descargarManual}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2"
          >
            <span>📄</span> Descargar Manual PDF
          </button>
        )}
      </header>

      {/* SELECTOR DE PROCESO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {procesos.map(p => (
          <button 
            key={p.id}
            onClick={() => {
              setProcesoSeleccionado(p);
              setPasoDetalle(null); 
            }}
            className={`p-4 rounded-xl border text-left transition-all ${procesoSeleccionado?.id === p.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white border-slate-200 hover:border-blue-300 text-slate-600'}`}
          >
            <div className="font-mono text-xs opacity-70 mb-1">{p.codigo}</div>
            <div className="font-bold text-sm leading-tight">{p.nombre}</div>
          </button>
        ))}
      </div>

      {/* ÁREA DE TRABAJO */}
      {procesoSeleccionado ? (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-4 px-4">
             <h3 className="font-bold text-slate-700">Diagrama de Flujo</h3>
             <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">Vista Automática</span>
          </div>

          <DiagramaAuto 
            pasos={procesoSeleccionado.pasos} 
            direction="LR" 
            onNodeClick={alHacerClicEnNodo} 
          />

          {pasoDetalle && (
            <div className="mt-6 border-t border-slate-100 pt-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl relative">
                <button onClick={() => setPasoDetalle(null)} className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 font-bold">✕</button>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Paso Seleccionado</span>
                  <h4 className="font-bold text-slate-800 text-lg">{pasoDetalle.texto}</h4>
                </div>
                <div className="mt-4 bg-white p-5 rounded-lg border border-blue-100 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                  <strong className="block text-blue-900 text-xs uppercase mb-2">Instrucción de Trabajo:</strong>
                  {pasoDetalle.instruccion || "⚠️ No se han registrado instrucciones detalladas para este paso."}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-400">
          Selecciona un proceso arriba para ver su diagrama
        </div>
      )}

      {/* --- MOLDE OCULTO PARA EL PDF (ESTO ES LO QUE SE IMPRIME) --- */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0px' }}>
        <div ref={printRef} style={{ padding: '40px', backgroundColor: '#ffffff', color: '#1e293b', width: '800px', fontFamily: 'sans-serif' }}>
          
          {/* Encabezado */}
          <div style={{ borderBottom: '2px solid #1e293b', paddingBottom: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>Manual de Procedimiento</h1>
              <p style={{ color: '#64748b', fontWeight: 'bold', marginTop: '4px', margin: 0 }}>Dreams Criteria - Gestión de Calidad</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Código</div>
              <div style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 'bold' }}>{procesoSeleccionado?.codigo}</div>
            </div>
          </div>

          {/* Info General */}
          <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Nombre del Proceso</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{procesoSeleccionado?.nombre}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
               <div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Bloque</span>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>Bloque {procesoSeleccionado?.bloque}</p>
               </div>
               <div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Nivel</span>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{procesoSeleccionado?.nivel}</p>
               </div>
            </div>
          </div>

          {/* Tabla */}
          <h3 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Instrucciones de Trabajo</h3>
          
          <table style={{ width: '100%', textAlign: 'left', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                <th style={{ padding: '12px', fontWeight: 'bold', width: '40px' }}>#</th>
                <th style={{ padding: '12px', fontWeight: 'bold', width: '200px' }}>Actividad</th>
                <th style={{ padding: '12px', fontWeight: 'bold' }}>Instrucción Detallada</th>
              </tr>
            </thead>
            <tbody>
              {procesoSeleccionado?.pasos.map((paso, index) => (
                <tr key={paso.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold', color: '#94a3b8', verticalAlign: 'top' }}>{index + 1}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#334155', verticalAlign: 'top' }}>
                    {paso.texto}
                    {paso.tipo === 'decision' && <div style={{ fontSize: '10px', color: '#d97706', marginTop: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>(Decisión)</div>}
                  </td>
                  <td style={{ padding: '16px', color: '#475569', verticalAlign: 'top', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {paso.instruccion || <span style={{ fontStyle: 'italic', color: '#cbd5e1' }}>Sin instrucción registrada.</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ marginTop: '48px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
            Documento generado automáticamente por Sistema DC v3.0 | {new Date().toLocaleDateString()}
          </div>

        </div>
      </div>
    </div>
  );
}