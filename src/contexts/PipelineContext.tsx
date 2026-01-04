import React, { createContext, useContext, type ReactNode } from 'react';
import type { Node, Edge } from 'reactflow';
import type { PipelineNodeData } from '../types/pipeline';
import { usePipelineExecution } from '../hooks/usePipelineExecution';
import type { ExecutionStatus, LogEntry } from '../graph/execution';

interface PipelineContextType {
  // Nodes and edges state
  nodes: Node<PipelineNodeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<PipelineNodeData>[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;

  // Execution state
  executionStatus: ExecutionStatus;
  logs: LogEntry[];
  isExecuting: boolean;
  executePipeline: () => Promise<void>;
  clearLogs: () => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(
  undefined
);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = React.useState<Node<PipelineNodeData>[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const nodesRef = React.useRef(nodes);
  const edgesRef = React.useRef(edges);

  // Keep refs in sync with state
  React.useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  React.useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const {
    executionStatus,
    logs,
    isExecuting,
    executePipeline: executePipelineInternal,
    clearLogs,
  } = usePipelineExecution();

  const executePipeline = React.useCallback(async () => {
    // Use refs to get the latest nodes and edges state
    await executePipelineInternal(nodesRef.current, edgesRef.current, setNodes);
  }, [executePipelineInternal, setNodes]);

  return (
    <PipelineContext.Provider
      value={{
        nodes,
        setNodes,
        edges,
        setEdges,
        executionStatus,
        logs,
        isExecuting,
        executePipeline,
        clearLogs,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
}
