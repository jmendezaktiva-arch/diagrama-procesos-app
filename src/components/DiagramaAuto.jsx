/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

// --- DISEÑO DE NODOS PREMIUM DREAMS CRITERIA ---
const ProcesoNode = ({ data }) => (
  <div className="bg-dreams-gold px-5 py-4 rounded-xl shadow-premium text-center min-w-[200px] relative border border-white/20">
    <Handle type="target" position={Position.Left} className="opacity-0" />
    <div className="text-[9px] uppercase font-black opacity-70 tracking-widest mb-1 text-white">Actividad</div>
    <div className="text-sm font-extrabold leading-tight text-white">{data.label}</div>
    <Handle type="source" position={Position.Right} className="opacity-0" />
  </div>
);

const DecisionNode = ({ data }) => (
  <div className="bg-dreams-blue px-6 py-6 rounded-[2.5rem] shadow-premium text-center min-w-[200px] relative border border-amber-500/40">
    <Handle type="target" position={Position.Left} className="opacity-0" />
    <div className="text-[9px] uppercase font-black text-amber-500 tracking-widest mb-1">Validación</div>
    <div className="text-sm font-extrabold leading-tight text-white italic">¿{data.label}?</div>
    <Handle type="source" position={Position.Right} className="opacity-0" />
  </div>
);

const nodeTypes = {
  proceso: ProcesoNode,
  decision: DecisionNode,
};

// Configuración del tamaño para el cálculo de posiciones
const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

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

    // 1. TRANSFORMAR TUS PASOS EN NODOS VISUALES
    const misNodos = pasos.map((paso) => ({
      id: paso.id.toString(),
      data: { label: paso.texto },
      position: { x: 0, y: 0 },
      type: paso.tipo === 'decision' ? 'decision' : 'proceso',
    }));

    // 2. CREAR LAS CONEXIONES (FLECHAS) PREMIUM
    const misConexiones = [];
    for (let i = 0; i < pasos.length - 1; i++) {
      misConexiones.push({
        id: `e${pasos[i].id}-${pasos[i+1].id}`,
        source: pasos[i].id.toString(),
        target: pasos[i+1].id.toString(),
        animated: true, 
        // Estilo de línea Dreams Criteria
        type: 'smoothstep', 
        style: { 
          stroke: '#64748b', 
          strokeWidth: 3,
        },
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
    <div style={{ width: '100%', height: '500px', background: '#f8fafc', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node)}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#ccc" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}