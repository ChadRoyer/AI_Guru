import React, { useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'react-flow-renderer';
import { useDiagram } from './DiagramContext';

const DiagramPanel: React.FC = () => {
  const { diagram, subscribe } = useDiagram();
  const [nodes, setNodes, onNodesChange] = useNodesState(diagram?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(diagram?.edges || []);

  useEffect(() => {
    if (diagram) {
      setNodes(diagram.nodes);
      setEdges(diagram.edges);
    }
  }, [diagram, setNodes, setEdges]);

  useEffect(() => {
    const unsub = subscribe(d => {
      setNodes(d.nodes);
      setEdges(d.edges);
    });
    return unsub;
  }, [subscribe, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
};

export default DiagramPanel;
