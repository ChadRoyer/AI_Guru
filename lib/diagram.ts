export interface FlowNode {
  id: string;
  data: {
    label: string;
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  [key: string]: any;
}

export interface ReactFlowJson {
  nodes: Array<any>;
  edges: Array<any>;
}

export interface ReactFlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Convert a plain JSON representation of a diagram into
 * the structure expected by react-flow-renderer.
 *
 * The input should conform to the schema described in the PRD:
 *
 * {
 *   nodes: [
 *     {
 *       id: string,
 *       data: { label: string },
 *       position: { x: number, y: number }
 *     }, ...
 *   ],
 *   edges: [
 *     {
 *       id: string,
 *       source: string,
 *       target: string
 *     }, ...
 *   ]
 * }
 */
export function jsonToReactFlow(json: ReactFlowJson): ReactFlowData {
  const result: ReactFlowData = {
    nodes: [],
    edges: []
  };

  if (!json || typeof json !== 'object') {
    return result;
  }

  const { nodes = [], edges = [] } = json;

  result.nodes = (Array.isArray(nodes) ? nodes : []).flatMap(n => {
    if (!n || typeof n !== 'object') return [];

    const id = String(n.id ?? '');
    const label = n.data?.label ?? '';
    const x = Number(n.position?.x ?? 0);
    const y = Number(n.position?.y ?? 0);

    if (!id) return [];

    return [
      {
        id,
        data: { label },
        position: { x, y }
      }
    ];
  });

  result.edges = (Array.isArray(edges) ? edges : []).flatMap(e => {
    if (!e || typeof e !== 'object') return [];

    const id = String(e.id ?? '');
    const source = String(e.source ?? '');
    const target = String(e.target ?? '');

    if (!id || !source || !target) return [];

    return [
      {
        id,
        source,
        target
      }
    ];
  });

  return result;
}
