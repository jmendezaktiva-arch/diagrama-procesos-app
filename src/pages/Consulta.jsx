/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import DiagramaAuto from '../components/DiagramaAuto'; 
import { toPng } from 'html-to-image';
export default function Consulta() {
  const [procesos, setProcesos] = useState([]);
  const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
  const [pasoDetalle, setPasoDetalle] = useState(null);

  // Referencia al "Molde" del PDF (el contenido invisible)
  const printRef = useRef();
  const diagramRef = useRef(null);

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
  const descargarDocumentacionHD = async () => {
    if (diagramRef.current === null) return;

    // Capturamos el diagrama con calidad profesional (3x)
    toPng(diagramRef.current, { 
      cacheBust: true, 
      pixelRatio: 3, 
      backgroundColor: '#f8fafc' 
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Dreams-Criteria-${procesoSeleccionado.codigo}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error al generar la imagen premium:', err);
      });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto">
      {/* ENCABEZADO PREMIUM DREAMS CRITERIA */}
      <header className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Consulta de Procesos
          </h1>
          <p className="text-label-premium mt-1">Dreams Criteria | Management System</p>
        </div>
        
        {procesoSeleccionado && (
          <button 
            onClick={descargarDocumentacionHD}
            className="bg-dreams-gold px-6 py-3 rounded-xl font-bold text-sm shadow-premium hover:scale-105 transition-transform text-white"
          >
            Descargar Documentación HD
          </button>
        )}
      </header>

      {/* CUERPO DE LA PÁGINA: SELECTOR + VISUALIZADOR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* MENÚ LATERAL DE PROCESOS */}
        <aside className="lg:col-span-1 space-y-4">
          <label className="text-label-premium">Listado de Procesos</label>
          <div className="space-y-2">
            {procesos.map(p => (
              <button
                key={p.id}
                onClick={() => { setProcesoSeleccionado(p); setPasoDetalle(null); }}
                className={`w-full text-left p-4 rounded-xl text-sm font-bold transition-all ${
                  procesoSeleccionado?.id === p.id 
                  ? 'bg-dreams-blue text-white shadow-lg ring-2 ring-amber-500/20' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                <div className="text-[10px] opacity-60 mb-1 font-mono">{p.codigo}</div>
                {p.nombre}
              </button>
            ))}
          </div>
        </aside>

        {/* VISUALIZADOR DEL DIAGRAMA */}
        <main className="lg:col-span-3 space-y-8">
          {procesoSeleccionado ? (
            <>
              {/* LIENZO DEL DIAGRAMA CON BORDE REDONDEADO PREMIUM */}
              <div ref={diagramRef} className="bg-white p-10 rounded-[2.5rem] shadow-premium border border-slate-200 overflow-hidden">
                <DiagramaAuto 
                  pasos={procesoSeleccionado.pasos} 
                  onNodeClick={alHacerClicEnNodo} 
                />
              </div>

              {/* PANEL DE DETALLE (SOLO APARECE AL TOCAR UN NODO) */}
              {pasoDetalle && (
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl border-l-4 border-amber-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                      Detalle de Actividad
                    </span>
                    <button onClick={() => setPasoDetalle(null)} className="opacity-40 hover:opacity-100">✕</button>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{pasoDetalle.texto}</h3>
                  <div className="prose prose-invert max-w-none italic opacity-80 border-t border-white/10 pt-4 text-slate-300">
                    {pasoDetalle.instruccion || "Sin instrucción registrada."}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ESTADO VACÍO */
            <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
              <span className="text-4xl mb-4 opacity-20">📊</span>
              <p className="font-medium italic">Seleccione un proceso para visualizar el ecosistema.</p>
            </div>
          )}
        </main>
      </div>

      {/* EL MOLDE DEL PDF SE QUEDA IGUAL (ES INVISIBLE) */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0px' }}>
        <div ref={printRef} style={{ padding: '40px', backgroundColor: '#ffffff', color: '#1e293b', width: '800px' }}>
            {/* ... contenido del manual ... */}
        </div>
      </div>
    </div>
  );
}