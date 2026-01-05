import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Node, Edge } from 'reactflow';
import type { PipelineNodeData } from '../types/pipeline';
import {
  topologicalSort,
  validateGraph,
  simulateNodeExecution,
} from './execution';

// Helper function to create a test node
function createNode(
  id: string,
  label: string = id,
  type: string = 'Transformer'
): Node<PipelineNodeData> {
  return {
    id,
    type: 'default',
    position: { x: 0, y: 0 },
    data: {
      label,
      type,
      status: 'idle',
    },
  };
}

describe('topologicalSort', () => {
  describe('Simple linear pipeline', () => {
    it('should return nodes in correct order for A -> B -> C', () => {
      const nodes: Node<PipelineNodeData>[] = [
        createNode('node-A'),
        createNode('node-B'),
        createNode('node-C'),
      ];
      const edges: Edge[] = [
        { id: 'e1', source: 'node-A', target: 'node-B' },
        { id: 'e2', source: 'node-B', target: 'node-C' },
      ];

      const result = topologicalSort(nodes, edges);

      expect(result).toEqual(['node-A', 'node-B', 'node-C']);
    });

    it('should handle single node pipeline', () => {
      const nodes: Node<PipelineNodeData>[] = [createNode('node-A')];
      const edges: Edge[] = [];

      const result = topologicalSort(nodes, edges);

      expect(result).toEqual(['node-A']);
    });
  });

  // Note: Branching is not allowed in this pipeline system (one input, one output per node)
  // These tests verify that topologicalSort algorithm can handle such graphs if they exist,
  // but validation rules prevent branching from being created in the first place.
  describe('Linear pipeline variations', () => {
    it('should handle simple linear chain A -> B -> C -> D', () => {
      const nodes: Node<PipelineNodeData>[] = [
        createNode('node-A'),
        createNode('node-B'),
        createNode('node-C'),
        createNode('node-D'),
      ];
      const edges: Edge[] = [
        { id: 'e1', source: 'node-A', target: 'node-B' },
        { id: 'e2', source: 'node-B', target: 'node-C' },
        { id: 'e3', source: 'node-C', target: 'node-D' },
      ];

      const result = topologicalSort(nodes, edges);

      expect(result).toEqual(['node-A', 'node-B', 'node-C', 'node-D']);
    });
  });

  describe('Multiple disconnected components', () => {
    it('should include all nodes from disconnected components', () => {
      const nodes: Node<PipelineNodeData>[] = [
        createNode('node-A'),
        createNode('node-B'),
        createNode('node-C'),
        createNode('node-D'),
      ];
      const edges: Edge[] = [
        { id: 'e1', source: 'node-A', target: 'node-B' },
        // node-C and node-D are disconnected
      ];

      const result = topologicalSort(nodes, edges);

      expect(result).toContain('node-A');
      expect(result).toContain('node-B');
      expect(result).toContain('node-C');
      expect(result).toContain('node-D');
      expect(result.length).toBe(4);
      // A should come before B
      expect(result.indexOf('node-A')).toBeLessThan(result.indexOf('node-B'));
    });

    it('should handle completely disconnected nodes', () => {
      const nodes: Node<PipelineNodeData>[] = [
        createNode('node-A'),
        createNode('node-B'),
        createNode('node-C'),
      ];
      const edges: Edge[] = [];

      const result = topologicalSort(nodes, edges);

      expect(result).toContain('node-A');
      expect(result).toContain('node-B');
      expect(result).toContain('node-C');
      expect(result.length).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty nodes array', () => {
      const nodes: Node<PipelineNodeData>[] = [];
      const edges: Edge[] = [];

      const result = topologicalSort(nodes, edges);

      expect(result).toEqual([]);
    });

    it('should handle nodes with multiple inputs correctly', () => {
      const nodes: Node<PipelineNodeData>[] = [
        createNode('node-A'),
        createNode('node-B'),
        createNode('node-C'),
      ];
      // Note: This edge case might not happen in practice due to validation,
      // but the function should handle it gracefully
      const edges: Edge[] = [
        { id: 'e1', source: 'node-A', target: 'node-C' },
        { id: 'e2', source: 'node-B', target: 'node-C' },
      ];

      const result = topologicalSort(nodes, edges);

      expect(result).toContain('node-A');
      expect(result).toContain('node-B');
      expect(result).toContain('node-C');
      expect(result.length).toBe(3);
      // C should come after both A and B (though validation prevents this)
      const cIndex = result.indexOf('node-C');
      const aIndex = result.indexOf('node-A');
      const bIndex = result.indexOf('node-B');
      expect(cIndex).toBeGreaterThan(aIndex);
      expect(cIndex).toBeGreaterThan(bIndex);
    });
  });
});

describe('validateGraph', () => {
  it('should reject empty pipeline', () => {
    const nodes: Node<PipelineNodeData>[] = [];
    const edges: Edge[] = [];

    const result = validateGraph(nodes, edges);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Pipeline is empty');
  });

  it('should reject disconnected nodes when more than one node exists', () => {
    const nodes: Node<PipelineNodeData>[] = [
      createNode('node-A'),
      createNode('node-B'),
    ];
    const edges: Edge[] = [];

    const result = validateGraph(nodes, edges);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('disconnected nodes');
  });

  it('should allow single node pipeline', () => {
    const nodes: Node<PipelineNodeData>[] = [createNode('node-A')];
    const edges: Edge[] = [];

    const result = validateGraph(nodes, edges);

    expect(result.valid).toBe(true);
  });

  it('should reject pipeline with cycles', () => {
    const nodes: Node<PipelineNodeData>[] = [
      createNode('node-A'),
      createNode('node-B'),
    ];
    const edges: Edge[] = [
      { id: 'e1', source: 'node-A', target: 'node-B' },
      { id: 'e2', source: 'node-B', target: 'node-A' },
    ];

    const result = validateGraph(nodes, edges);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('cycles');
  });

  it('should accept valid linear pipeline', () => {
    const nodes: Node<PipelineNodeData>[] = [
      createNode('node-A'),
      createNode('node-B'),
      createNode('node-C'),
    ];
    const edges: Edge[] = [
      { id: 'e1', source: 'node-A', target: 'node-B' },
      { id: 'e2', source: 'node-B', target: 'node-C' },
    ];

    const result = validateGraph(nodes, edges);

    expect(result.valid).toBe(true);
  });

  it('should reject pipeline with isolated nodes', () => {
    const nodes: Node<PipelineNodeData>[] = [
      createNode('node-A', 'Node A'),
      createNode('node-B', 'Node B'),
      createNode('node-C', 'Node C'),
    ];
    const edges: Edge[] = [
      { id: 'e1', source: 'node-A', target: 'node-B' },
      // node-C is isolated (not connected to any edge)
    ];

    const result = validateGraph(nodes, edges);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('disconnected nodes');
    expect(result.error).toContain('Node C');
  });

  it('should reject pipeline with multiple isolated nodes', () => {
    const nodes: Node<PipelineNodeData>[] = [
      createNode('node-A', 'Node A'),
      createNode('node-B', 'Node B'),
      createNode('node-C', 'Node C'),
      createNode('node-D', 'Node D'),
    ];
    const edges: Edge[] = [
      { id: 'e1', source: 'node-A', target: 'node-B' },
      // node-C and node-D are isolated
    ];

    const result = validateGraph(nodes, edges);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('disconnected nodes');
    expect(result.error).toContain('Node C');
    expect(result.error).toContain('Node D');
  });
});

describe('simulateNodeExecution', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should resolve after default delay', async () => {
    const promise = simulateNodeExecution('node-1', 'Test Node');

    vi.advanceTimersByTime(1000);
    await promise;

    // If we reach here, the promise resolved successfully
    expect(true).toBe(true);
  });

  it('should resolve after custom delay', async () => {
    const promise = simulateNodeExecution('node-1', 'Test Node', 500);

    vi.advanceTimersByTime(500);
    await promise;

    // If we reach here, the promise resolved successfully
    expect(true).toBe(true);
  });
});
