import React, { createContext, useContext, useState } from 'react';

export interface DiagramData {
  nodes: any[];
  edges: any[];
}

interface DiagramContextValue {
  diagram: DiagramData | null;
  diagramUpdated: (d: DiagramData) => void;
}

const DiagramContext = createContext<DiagramContextValue>({
  diagram: null,
  diagramUpdated: () => {}
});

export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [diagram, setDiagram] = useState<DiagramData | null>(null);
  const diagramUpdated = (d: DiagramData) => setDiagram(d);
  return (
    <DiagramContext.Provider value={{ diagram, diagramUpdated }}>
      {children}
    </DiagramContext.Provider>
  );
};

export const useDiagram = () => useContext(DiagramContext);
