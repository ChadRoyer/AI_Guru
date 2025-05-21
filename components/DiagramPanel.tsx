import React, { useEffect, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'react-flow-renderer';
import { useDiagram } from './DiagramContext';
import OpportunitiesPanel, { Opportunity } from './OpportunitiesPanel';

function parseOpportunities(md: string): Opportunity[] {
  const parts = md
    .trim()
    .split(/\n(?=\d+\.\s)/)
    .map(p => p.trim())
    .filter(Boolean);

  return parts.map((part, idx) => {
    const noNum = part.replace(/^\d+\.\s*/, '');
    const lines = noNum.split(/\n+/);
    const title = lines[0]?.trim() || `Item ${idx + 1}`;
    const description = lines.slice(1).join('\n').trim();
    return { id: String(idx + 1), title, description };
  });
}

const DiagramPanel: React.FC = () => {
  const { diagram, subscribe } = useDiagram();
  const [nodes, setNodes, onNodesChange] = useNodesState(diagram?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(diagram?.edges || []);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);

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

  const analyze = async () => {
    if (!diagram) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai?phase=suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagram)
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const text = await res.text();
      setOpps(parseOpportunities(text));
    } catch (err) {
      console.error('Analyze failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      </div>
      <div style={{ padding: '0.5rem', borderTop: '1px solid #ccc' }}>
        <button onClick={analyze} disabled={!diagram || loading} style={{ marginBottom: '0.5rem' }}>
          {loading ? 'Analyzing...' : 'Analyze Opportunities'}
        </button>
        {opps.length > 0 && <OpportunitiesPanel opportunities={opps} />}
      </div>
    </div>
  );
};

export default DiagramPanel;
