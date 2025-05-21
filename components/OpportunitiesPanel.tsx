import React, { useState } from 'react';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
}

const initialOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Optimize Sales Funnel',
    description:
      'Identify steps where leads drop off to improve conversions.'
  },
  {
    id: '2',
    title: 'Automate Reporting',
    description:
      'Replace manual report generation with automated dashboards.'
  },
  {
    id: '3',
    title: 'Improve Onboarding',
    description:
      'Streamline new employee setup to reduce ramp-up time.'
  }
];

const OpportunitiesPanel: React.FC = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      {initialOpportunities.map(opp => (
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
