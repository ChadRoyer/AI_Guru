import React from 'react';
import ReactFlow from 'react-flow-renderer';

const DiagramPanel: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f0f0f0' }}>
      <ReactFlow nodes={[]} edges={[]} />
    </div>
  );
};

export default DiagramPanel;
