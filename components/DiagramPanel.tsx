import React from 'react';
import ReactFlow from 'react-flow-renderer';
import { useDiagram } from './DiagramContext';

const DiagramPanel: React.FC = () => {
  const { diagram } = useDiagram();
  return (
    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }}>
      <ReactFlow nodes={diagram?.nodes || []} edges={diagram?.edges || []} />
    </div>
  );
};

export default DiagramPanel;
