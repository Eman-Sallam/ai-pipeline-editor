import { useCallback, useRef, useState } from 'react';
import type { Node, Edge } from 'reactflow';
import type { PipelineNodeData, NodeStatus } from '../types/pipeline';
import {
  validateGraph,
  topologicalSort,
  simulateNodeExecution,
  generateLogMessage,
  formatTimestamp,
  type ExecutionStatus,
  type LogEntry,
} from '../graph/execution';

/**
 * Hook responsible for pipeline execution logic and state.
 */
export function usePipelineExecution() {
  const [executionStatus, setExecutionStatus] =
    useState<ExecutionStatus>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Synchronous lock to prevent concurrent execution
  const isExecutingRef = useRef(false);

  /**
   * Adds a log entry.
   * New logs are added at the top (latest first).
   */
  const addLog = useCallback(
    (message: string, type: LogEntry['type'] = 'info') => {
      const logEntry: LogEntry = {
        timestamp: formatTimestamp(),
        message,
        type,
      };
      setLogs((prev) => [logEntry, ...prev]);
    },
    []
  );

  /**
   * Clears all logs.
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  /**
   * Executes the pipeline by simulating node execution in topological order.
   *
   * @param nodes - Snapshot of nodes (used as source of truth for execution order)
   * @param edges - Snapshot of edges
   * @param setNodes - React Flow setNodes state setter
   */
  const executePipeline = useCallback(
    async (
      nodes: Node<PipelineNodeData>[],
      edges: Edge[],
      setNodes: React.Dispatch<React.SetStateAction<Node<PipelineNodeData>[]>>
    ) => {
      // Prevent concurrent execution
      if (isExecutingRef.current) return;

      isExecutingRef.current = true;
      setIsExecuting(true);
      setExecutionStatus('running');

      try {
        // 1) Validate graph before execution
        const validation = validateGraph(nodes, edges);
        if (!validation.valid) {
          setExecutionStatus('error');
          addLog(validation.error || 'Validation failed', 'error');
          return;
        }

        // Mark the start of execution (after validation passes)
        addLog('Pipeline execution started', 'info');

        // 2) Reset all nodes to idle
        setNodes((prev) =>
          prev.map((node) => ({
            ...node,
            data: { ...node.data, status: 'idle' as NodeStatus },
          }))
        );

        // 3) Determine execution order
        const executionOrder = topologicalSort(nodes, edges);
        addLog(
          `Execution order determined: ${executionOrder.length} node(s)`,
          'info'
        );

        // 4) Execute nodes sequentially
        for (const nodeId of executionOrder) {
          const node = nodes.find((n) => n.id === nodeId);
          if (!node) continue;

          const { label, type } = node.data;

          // Mark node as running
          setNodes((prev) =>
            prev.map((n) =>
              n.id === nodeId
                ? {
                    ...n,
                    data: { ...n.data, status: 'running' as NodeStatus },
                  }
                : n
            )
          );
          addLog(generateLogMessage(label, type, 'started'), 'info');

          // Simulate execution delay
          await simulateNodeExecution(nodeId, label, 1000);

          // Mark node as completed
          setNodes((prev) =>
            prev.map((n) =>
              n.id === nodeId
                ? {
                    ...n,
                    data: { ...n.data, status: 'completed' as NodeStatus },
                  }
                : n
            )
          );
          addLog(generateLogMessage(label, type, 'completed'), 'success');
        }

        // 5) Execution finished successfully
        setExecutionStatus('completed');
        addLog('Pipeline execution completed successfully', 'success');
      } catch (error) {
        setExecutionStatus('error');
        addLog(
          `Execution failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
          'error'
        );
      } finally {
        // Release execution lock
        isExecutingRef.current = false;
        setIsExecuting(false);
      }
    },
    [addLog]
  );

  return {
    executionStatus,
    logs,
    isExecuting,
    executePipeline,
    clearLogs,
    addLog,
  };
}
