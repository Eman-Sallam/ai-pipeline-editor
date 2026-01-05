import type { Node, Edge } from 'reactflow';
import type { PipelineNodeData } from '../types/pipeline';

/**
 * Execution status type
 */
export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'error';

/**
 * Log entry type for execution logs
 */
export type LogEntry = {
  timestamp: string;
  message: string;
  type?: 'info' | 'success' | 'error';
};

/**
 * Validates the graph before execution
 * @param nodes - All nodes in the graph
 * @param edges - All edges in the graph
 * @returns Validation result with error message if invalid
 */
export function validateGraph(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[]
): { valid: boolean; error?: string } {
  // Check if there are any nodes
  if (nodes.length === 0) {
    return {
      valid: false,
      error: 'Pipeline is empty. Add at least one node to execute.',
    };
  }

  // Check if there are connections between nodes
  // If there's more than one node, there must be at least one connection
  if (nodes.length > 1 && edges.length === 0) {
    return {
      valid: false,
      error: 'Pipeline has disconnected nodes. Connect all nodes to execute.',
    };
  }

  // Check for isolated nodes (nodes not connected to any edges)
  if (nodes.length > 1 && edges.length > 0) {
    const connectedNodeIds = new Set<string>();

    // Collect all node IDs that are connected via edges
    edges.forEach((edge) => {
      if (edge.source) {
        connectedNodeIds.add(edge.source);
      }
      if (edge.target) {
        connectedNodeIds.add(edge.target);
      }
    });

    // Find isolated nodes (nodes not in connectedNodeIds)
    const isolatedNodes = nodes.filter(
      (node) => !connectedNodeIds.has(node.id)
    );

    if (isolatedNodes.length > 0) {
      const isolatedNodeLabels = isolatedNodes
        .map((node) => node.data.label || node.id)
        .join(', ');
      return {
        valid: false,
        error: `Pipeline has disconnected nodes: ${isolatedNodeLabels}. All nodes must be connected.`,
      };
    }
  }

  // Check for cycles using DFS
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize in-degree for all nodes
  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    graph.set(node.id, []);
  });

  // Build graph and calculate in-degrees
  edges.forEach((edge) => {
    if (edge.source && edge.target) {
      const neighbors = graph.get(edge.source) || [];
      neighbors.push(edge.target);
      graph.set(edge.source, neighbors);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
  });

  // Check for cycles using DFS
  const visited = new Set<string>();
  const recStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (recStack.has(nodeId)) {
      return true; // Cycle detected
    }
    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) {
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  };

  // Check all nodes for cycles
  for (const node of nodes) {
    if (!visited.has(node.id) && hasCycle(node.id)) {
      return {
        valid: false,
        error: 'Pipeline contains cycles. Please fix the connections.',
      };
    }
  }

  return { valid: true };
}

/**
 * Performs topological sort on the graph to determine execution order
 * @param nodes - All nodes in the graph
 * @param edges - All edges in the graph
 * @returns Array of node IDs in execution order
 */
export function topologicalSort(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[]
): string[] {
  // Build adjacency list and in-degree map
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize all nodes
  nodes.forEach((node) => {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  // Build graph and calculate in-degrees
  edges.forEach((edge) => {
    if (edge.source && edge.target) {
      const neighbors = graph.get(edge.source) || [];
      neighbors.push(edge.target);
      graph.set(edge.source, neighbors);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }
  });

  // Kahn's algorithm for topological sort
  const queue: string[] = [];
  const result: string[] = [];

  // Find all nodes with in-degree 0 (source nodes)
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  // Process nodes
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);

      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If result length doesn't match nodes length, there might be disconnected components
  // Add any remaining nodes (disconnected components)
  const processed = new Set(result);
  nodes.forEach((node) => {
    if (!processed.has(node.id)) {
      result.push(node.id);
    }
  });

  return result;
}

/**
 * Simulates execution of a single node
 * @param _nodeId - ID of the node to execute
 * @param _nodeLabel - Label/name of the node
 * @param delay - Delay in milliseconds (default: 1000ms)
 * @returns Promise that resolves after the delay
 */
export async function simulateNodeExecution(
  _nodeId: string,
  _nodeLabel: string,
  delay: number = 1000
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

/**
 * Log templates based on node type
 */
const logTemplates: Record<
  string,
  {
    started: string;
    completed: string;
    error: string;
  }
> = {
  'Data Source': {
    started: 'Reading input data',
    completed: 'Input data loaded',
    error: 'Failed to read input data',
  },
  Transformer: {
    started: 'Transforming data',
    completed: 'Data transformation completed',
    error: 'Data transformation failed',
  },
  Model: {
    started: 'Running model inference',
    completed: 'Predictions generated',
    error: 'Model inference failed',
  },
  Sink: {
    started: 'Writing output',
    completed: 'Output saved successfully',
    error: 'Failed to save output',
  },
};

/**
 * Default log templates for unknown node types
 */
const defaultLogTemplates = {
  started: 'Processing',
  completed: 'Processing completed',
  error: 'Processing failed',
};

/**
 * Generates a log message for node execution based on node type
 * @param nodeLabel - Label/name of the node (for contextual information)
 * @param nodeType - Type of the node (determines the log template)
 * @param action - Action type ('started' | 'completed' | 'error')
 * @returns Log message string in format: "${nodeLabel}: ${template_message}"
 */
export function generateLogMessage(
  nodeLabel: string,
  nodeType: string,
  action: 'started' | 'completed' | 'error'
): string {
  // Use node type to get the appropriate template
  const templates = logTemplates[nodeType] || defaultLogTemplates;
  const templateMessage = templates[action];

  // Use label as contextual information, fallback to type if label is empty
  const displayName = nodeLabel || nodeType;

  return `${displayName}: ${templateMessage}`;
}

/**
 * Formats timestamp for log entries
 * @returns Formatted timestamp string (HH:MM:SS)
 */
export function formatTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
