import React, { createContext, useContext, useState, useRef } from 'react';

export interface DiagramData {
  nodes: any[];
  edges: any[];
}

interface DiagramContextValue {
  diagram: DiagramData | null;
  diagramUpdated: (d: DiagramData) => void;
  subscribe: (cb: (d: DiagramData) => void) => () => void;
}

const DiagramContext = createContext<DiagramContextValue>({
  diagram: null,
  diagramUpdated: () => {},
  subscribe: () => () => {}
});

export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [diagram, setDiagram] = useState<DiagramData | null>(null);
  const handlers = useRef<Array<(d: DiagramData) => void>>([]);

  const diagramUpdated = (d: DiagramData) => {
    setDiagram(d);
    handlers.current.forEach(h => h(d));
  };

  const subscribe = (cb: (d: DiagramData) => void) => {
    handlers.current.push(cb);
    return () => {
      handlers.current = handlers.current.filter(h => h !== cb);
    };
  };
  return (
    <DiagramContext.Provider value={{ diagram, diagramUpdated, subscribe }}>
      {children}
    </DiagramContext.Provider>
  );
};

export const useDiagram = () => useContext(DiagramContext);
