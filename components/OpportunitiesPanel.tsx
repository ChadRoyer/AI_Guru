import React, { useState } from 'react';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
}

export interface OpportunitiesPanelProps {
  opportunities: Opportunity[];
}

const OpportunitiesPanel: React.FC<OpportunitiesPanelProps> = ({ opportunities }) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      {opportunities.map(opp => (
        <div
          key={opp.id}
          style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}
        >
          <button
            onClick={() => toggle(opp.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {opp.title}
          </button>
          {open[opp.id] && (
            <div style={{ marginTop: '0.5rem' }}>{opp.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OpportunitiesPanel;
