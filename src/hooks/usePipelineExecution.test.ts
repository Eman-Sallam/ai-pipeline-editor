import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { Node, Edge } from 'reactflow';
import type { PipelineNodeData } from '../types/pipeline';
import { usePipelineExecution } from './usePipelineExecution';

// Helper to create test nodes
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

// Deterministic mock for React Flow setNodes
function createSetNodesMock(initial: Node<PipelineNodeData>[]) {
  let current = [...initial];

  const setNodesMock = vi.fn((updater) => {
    if (typeof updater === 'function') {
      const next = updater(current);
      current = Array.isArray(next) ? next : current;
      return current;
    }
    current = updater;
    return current;
  });

  return { setNodesMock };
}

describe('usePipelineExecution', () => {
  describe('Validation errors', () => {
    it('rejects empty pipeline', async () => {
      const nodes: Node<PipelineNodeData>[] = [];
      const edges: Edge[] = [];

      const setNodesMock = vi.fn();
      const { result } = renderHook(() => usePipelineExecution());

      await act(async () => {
        await result.current.executePipeline(nodes, edges, setNodesMock);
      });

      await waitFor(() => {
        expect(result.current.executionStatus).toBe('error');
      });
    });

    it('rejects pipeline with cycles', async () => {
      const nodes = [createNode('A'), createNode('B')];
      const edges: Edge[] = [
        { id: 'e1', source: 'A', target: 'B' },
        { id: 'e2', source: 'B', target: 'A' },
      ];

      const { setNodesMock } = createSetNodesMock(nodes);
      const { result } = renderHook(() => usePipelineExecution());

      await act(async () => {
        await result.current.executePipeline(nodes, edges, setNodesMock);
      });

      await waitFor(() => {
        expect(result.current.executionStatus).toBe('error');
      });
    });
  });

  describe('Successful execution', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('executes a single node pipeline', async () => {
      const nodes = [createNode('A', 'Data Source Node', 'Data Source')];
      const edges: Edge[] = [];

      const { setNodesMock } = createSetNodesMock(nodes);
      const { result } = renderHook(() => usePipelineExecution());

      await act(async () => {
        const promise = result.current.executePipeline(
          nodes,
          edges,
          setNodesMock
        );
        await vi.runAllTimersAsync();
        await promise;
      });

      expect(result.current.executionStatus).toBe('completed');
    });

    it('executes nodes in correct order', async () => {
      const nodes = [
        createNode('A', 'Source', 'Data Source'),
        createNode('B', 'Transform', 'Transformer'),
        createNode('C', 'Model', 'Model'),
      ];
      const edges: Edge[] = [
        { id: 'e1', source: 'A', target: 'B' },
        { id: 'e2', source: 'B', target: 'C' },
      ];

      const runningOrder: string[] = [];
      const { setNodesMock } = createSetNodesMock(nodes);

      setNodesMock.mockImplementation((updater) => {
        const next = typeof updater === 'function' ? updater(nodes) : updater;
        next.forEach((n: Node<PipelineNodeData>) => {
          if (n.data.status === 'running' && !runningOrder.includes(n.id)) {
            runningOrder.push(n.id);
          }
        });
        return next;
      });

      const { result } = renderHook(() => usePipelineExecution());

      await act(async () => {
        const promise = result.current.executePipeline(
          nodes,
          edges,
          setNodesMock
        );
        await vi.runAllTimersAsync();
        await promise;
      });

      expect(runningOrder).toEqual(['A', 'B', 'C']);
      expect(result.current.executionStatus).toBe('completed');
    });

    it('prevents concurrent execution', async () => {
      const nodes = [createNode('A', 'Source', 'Data Source')];
      const edges: Edge[] = [];

      const { setNodesMock } = createSetNodesMock(nodes);
      const { result } = renderHook(() => usePipelineExecution());

      await act(async () => {
        const p1 = result.current.executePipeline(nodes, edges, setNodesMock);
        const p2 = result.current.executePipeline(nodes, edges, setNodesMock);
        await vi.runAllTimersAsync();
        await Promise.all([p1, p2]);
      });

      const startLogs = result.current.logs.filter(
        (l) => l.message === 'Pipeline execution started'
      );
      expect(startLogs.length).toBe(1);
    });
  });
});
