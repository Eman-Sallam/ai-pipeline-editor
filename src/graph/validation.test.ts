import { describe, it, expect } from 'vitest';
import type { Connection, Edge } from 'reactflow';
import { validateConnection } from './validation';

describe('validateConnection', () => {
  describe('Self-link prevention', () => {
    it('should reject connection where source equals target', () => {
      const connection: Connection = {
        source: 'node-1',
        target: 'node-1',
        sourceHandle: null,
        targetHandle: null,
      };
      const edges: Edge[] = [];

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot connect a node to itself');
    });
  });

  describe('Cycle detection', () => {
    it('should reject connection that creates a simple cycle (A->B, B->A)', () => {
      const edges: Edge[] = [{ id: 'e1', source: 'node-A', target: 'node-B' }];
      const connection: Connection = {
        source: 'node-B',
        target: 'node-A',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'This connection would create a cycle in the pipeline'
      );
    });

    it('should reject connection that creates a longer cycle (A->B->C, C->A)', () => {
      const edges: Edge[] = [
        { id: 'e1', source: 'node-A', target: 'node-B' },
        { id: 'e2', source: 'node-B', target: 'node-C' },
      ];
      const connection: Connection = {
        source: 'node-C',
        target: 'node-A',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'This connection would create a cycle in the pipeline'
      );
    });

    it('should allow valid connections that do not create cycles', () => {
      const edges: Edge[] = [{ id: 'e1', source: 'node-A', target: 'node-B' }];
      const connection: Connection = {
        source: 'node-B',
        target: 'node-C',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(true);
    });
  });

  describe('Duplicate input/output prevention (No branching allowed)', () => {
    it('should reject connection if target node already has an input', () => {
      const edges: Edge[] = [{ id: 'e1', source: 'node-A', target: 'node-B' }];
      const connection: Connection = {
        source: 'node-C',
        target: 'node-B',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toContain(
        'Target node already has an input connection'
      );
    });

    it('should reject connection if source node already has an output (prevents branching)', () => {
      const edges: Edge[] = [{ id: 'e1', source: 'node-A', target: 'node-B' }];
      const connection: Connection = {
        source: 'node-A',
        target: 'node-C',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toContain(
        'Source node already has an output connection'
      );
    });

    it('should prevent branching: A -> B, A -> C (same source, multiple targets)', () => {
      const edges: Edge[] = [{ id: 'e1', source: 'node-A', target: 'node-B' }];
      // Try to create another connection from A to C (branching)
      const connection: Connection = {
        source: 'node-A',
        target: 'node-C',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('output connection');
    });

    it('should prevent merging: B -> C, D -> C (same target, multiple sources)', () => {
      const edges: Edge[] = [{ id: 'e1', source: 'node-B', target: 'node-C' }];
      // Try to create another connection to C from D (merging/branching)
      const connection: Connection = {
        source: 'node-D',
        target: 'node-C',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('input connection');
    });
  });

  describe('Valid connections', () => {
    it('should allow valid connection between two unconnected nodes', () => {
      const edges: Edge[] = [];
      const connection: Connection = {
        source: 'node-A',
        target: 'node-B',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow multiple valid connections in a chain', () => {
      const edges: Edge[] = [{ id: 'e1', source: 'node-A', target: 'node-B' }];
      const connection: Connection = {
        source: 'node-B',
        target: 'node-C',
        sourceHandle: null,
        targetHandle: null,
      };

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should reject connection without source', () => {
      const connection: Connection = {
        source: null,
        target: 'node-B',
        sourceHandle: null,
        targetHandle: null,
      };
      const edges: Edge[] = [];

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Connection must have both source and target');
    });

    it('should reject connection without target', () => {
      const connection: Connection = {
        source: 'node-A',
        target: null,
        sourceHandle: null,
        targetHandle: null,
      };
      const edges: Edge[] = [];

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Connection must have both source and target');
    });

    it('should reject connection with invalid source handle type', () => {
      const connection: Connection = {
        source: 'node-A',
        target: 'node-B',
        sourceHandle: 'input-handle',
        targetHandle: null,
      };
      const edges: Edge[] = [];

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Source must be an output handle');
    });

    it('should reject connection with invalid target handle type', () => {
      const connection: Connection = {
        source: 'node-A',
        target: 'node-B',
        sourceHandle: null,
        targetHandle: 'output-handle',
      };
      const edges: Edge[] = [];

      const result = validateConnection(connection, edges);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Target must be an input handle');
    });
  });
});
