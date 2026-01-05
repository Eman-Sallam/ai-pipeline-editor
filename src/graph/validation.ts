import type { Edge, Connection } from 'reactflow';

/**
 * Validation result for connection attempts
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a connection between nodes according to pipeline rules
 *
 * @param connection - The connection being attempted (source → target)
 * @param edges - All existing edges in the graph
 * @returns ValidationResult indicating if connection is valid and error message if not
 *
 * Validation rules:
 * - ✅ Output → input only: Enforce direction (source = output, target = input)
 * - ✅ No self-connections: Prevent node connecting to itself
 * - ✅ One input per node: Each node accepts one input connection only
 * - ✅ One output per node: Each node accepts one output connection only
 * - ✅ Prevent cycles: Use DFS to check if new edge creates cycle
 */
export function validateConnection(
  connection: Connection,
  edges: Edge[]
): ValidationResult {
  // Rule 1: Check if connection has required fields
  if (!connection.source || !connection.target) {
    return {
      valid: false,
      error: 'Connection must have both source and target',
    };
  }

  // Rule 2: No self-connections
  if (connection.source === connection.target) {
    return {
      valid: false,
      error: 'Cannot connect a node to itself',
    };
  }

  // Rule 3: Output → input only (source = output, target = input)
  // ReactFlow enforces that connections can only be made from source handles to target handles
  // If handle IDs are explicitly provided, we validate them here as an extra safety check
  // Note: In our PipelineNode, handles use type='source' and type='target' without explicit IDs
  // So this validation is primarily for future cases where handles might have explicit IDs
  if (connection.sourceHandle && connection.sourceHandle.includes('input')) {
    return {
      valid: false,
      error: 'Source must be an output handle',
    };
  }

  if (connection.targetHandle && connection.targetHandle.includes('output')) {
    return {
      valid: false,
      error: 'Target must be an input handle',
    };
  }

  // Rule 4: One input per node - check if target already has an input connection
  const existingInputConnection = edges.find(
    (edge) => edge.target === connection.target
  );

  if (existingInputConnection) {
    return {
      valid: false,
      error:
        'Target node already has an input connection. Each node accepts only one input.',
    };
  }

  // Rule 5: One output per node - check if source already has an output connection
  const existingOutputConnection = edges.find(
    (edge) => edge.source === connection.source
  );

  if (existingOutputConnection) {
    return {
      valid: false,
      error:
        'Source node already has an output connection. Each node accepts only one output.',
    };
  }

  // Rule 6: Prevent cycles - check if adding this edge would create a cycle
  if (wouldCreateCycle(connection, edges)) {
    return {
      valid: false,
      error: 'This connection would create a cycle in the pipeline',
    };
  }

  return { valid: true };
}

/**
 * Checks if adding a new edge would create a cycle in the graph
 * Uses DFS (Depth-First Search) to detect cycles
 *
 * @param newConnection - The connection being added
 * @param existingEdges - All existing edges in the graph
 * @returns true if adding the edge would create a cycle, false otherwise
 */
function wouldCreateCycle(
  newConnection: Connection,
  existingEdges: Edge[]
): boolean {
  if (!newConnection.source || !newConnection.target) {
    return false;
  }

  // Build adjacency list from existing edges only (without the new edge)
  const graph = new Map<string, string[]>();

  for (const edge of existingEdges) {
    if (edge.source && edge.target) {
      if (!graph.has(edge.source)) {
        graph.set(edge.source, []);
      }
      graph.get(edge.source)!.push(edge.target);
    }
  }

  // Check if target can reach source in the existing graph
  // If yes, then adding source->target would create a cycle
  const visited = new Set<string>();

  /**
   * DFS to check if we can reach targetNode from startNode
   */
  const canReach = (startNode: string, targetNode: string): boolean => {
    if (startNode === targetNode) {
      return true;
    }

    if (visited.has(startNode)) {
      return false;
    }

    visited.add(startNode);

    const neighbors = graph.get(startNode) || [];
    for (const neighbor of neighbors) {
      if (canReach(neighbor, targetNode)) {
        return true;
      }
    }

    return false;
  };

  // Check if target can reach source (before adding the new edge)
  // If target can reach source, then source->target would create a cycle
  return canReach(newConnection.target, newConnection.source);
}
