import React, { useEffect } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

// Configuración del tamaño de las cajitas
const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

// FUNCIÓN MATEMÁTICA: Calcula posiciones automáticamente (Auto-Layout)
const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // 'LR' = Left to Right (Horizontal) | 'TB' = Top to Bottom (Vertical)
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function DiagramaAuto({ pasos, direction = 'LR', onNodeClick }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!pasos || pasos.length === 0) return;

    // 1. CONVERTIR TUS DATOS DE FIREBASE A "IDIOMA REACT FLOW"
    // CORRECCIÓN: Quitamos 'index' de aquí porque no se usa
    const misNodos = pasos.map((paso) => ({
      id: paso.id.toString(),
      data: { label: paso.texto },
      position: { x: 0, y: 0 }, // Dagre lo calculará después
      // Si es decisión (rombo) lo pintamos naranja, si es proceso azul
      style: { 
        background: paso.tipo === 'decision' ? '#fff7ed' : '#eff6ff', 
        border: paso.tipo === 'decision' ? '1px solid #f97316' : '1px solid #2563eb',
        borderRadius: paso.tipo === 'decision' ? '50%' : '8px', 
        width: 180,
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#1e293b',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      },
      type: 'default', // Tipo estándar
    }));

    // 2. CREAR LAS CONEXIONES (FLECHAS)
    const misConexiones = [];
    for (let i = 0; i < pasos.length - 1; i++) {
      misConexiones.push({
        id: `e${pasos[i].id}-${pasos[i+1].id}`,
        source: pasos[i].id.toString(),
        target: pasos[i+1].id.toString(),
        animated: true, // Flecha animada
        style: { stroke: '#94a3b8' },
      });
    }

    // 3. APLICAR MATEMÁTICAS (AUTO-LAYOUT)
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      misNodos,
      misConexiones,
      direction // Horizontal o Vertical
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [pasos, direction, setNodes, setEdges]); 

  return (
    <div style={{ width: '100%', height: '500px' }} className="bg-slate-50 rounded-xl border border-slate-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => onNodeClick && onNodeClick(node)}
        fitView 
      >
        <Background color="#ccc" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}