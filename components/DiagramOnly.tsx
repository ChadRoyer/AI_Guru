import React, { useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, Node, Edge } from 'react-flow-renderer';

interface Props {
  nodes: Node[];
  edges: Edge[];
}

const DiagramOnly: React.FC<Props> = ({ nodes, edges }) => {
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(nodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => setRfNodes(nodes), [nodes, setRfNodes]);
  useEffect(() => setRfEdges(edges), [edges, setRfEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </div>
  );
};

export default DiagramOnly;
