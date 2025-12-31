import type { Edge } from 'reactflow';

/**
 * Node type from API response
 */
export type ApiNodeType = {
  id: string;
  name: string;
};

/**
 * Node status type
 */
export type NodeStatus = 'idle' | 'running' | 'completed' | 'error';

/**
 * Custom data for React Flow nodes
 */
export type PipelineNodeData = {
  label: string; // node name/display text
  type: string; // node type ID from API
  status: NodeStatus;
};

/**
 * React Flow edge type for pipeline
 */
export type PipelineEdge = Edge;
