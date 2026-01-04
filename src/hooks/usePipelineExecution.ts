import React, { useState, useCallback } from 'react';
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
 * Hook for managing pipeline execution state and logic
 */
export function usePipelineExecution() {
  const [executionStatus, setExecutionStatus] =
    useState<ExecutionStatus>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  /**
   * Adds a log entry to the logs array
   */
  const addLog = useCallback(
    (message: string, type: LogEntry['type'] = 'info') => {
      const logEntry: LogEntry = {
        timestamp: formatTimestamp(),
        message,
        type,
      };
      // Add new log at the top of the list
      setLogs((prev) => [logEntry, ...prev]);
    },
    []
  );

  /**
   * Clears all logs
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  /**
   * Executes the pipeline
   */
  const executePipeline = useCallback(
    async (
      nodes: Node<PipelineNodeData>[],
      edges: Edge[],
      setNodes: React.Dispatch<React.SetStateAction<Node<PipelineNodeData>[]>>
    ) => {
      // Prevent multiple executions
      if (isExecuting) {
        return;
      }

      setIsExecuting(true);
      setExecutionStatus('running');

      try {
        // Step 1: Validate graph
        const validation = validateGraph(nodes, edges);
        if (!validation.valid) {
          setExecutionStatus('error');
          addLog(validation.error || 'Validation failed', 'error');
          setIsExecuting(false);
          return;
        }

        // Step 2: Reset all nodes to idle
        setNodes((nds) => {
          const updated = nds.map((node) => ({
            ...node,
            data: {
              ...node.data,
              status: 'idle' as NodeStatus,
            },
          }));
          // Force React Flow to detect the change by creating a new array reference
          return [...updated];
        });
        // Small delay to ensure React processes the update
        await new Promise((resolve) => setTimeout(resolve, 50));
        addLog('Pipeline execution started', 'info');

        // Step 3: Perform topological sort to get execution order
        // Wait a bit for nodes state to update after reset
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Get fresh nodes state after reset
        let currentNodesState: Node<PipelineNodeData>[] = [];
        setNodes((nds) => {
          currentNodesState = [...nds];
          return nds;
        });
        await new Promise((resolve) => setTimeout(resolve, 50));

        const executionOrder = topologicalSort(currentNodesState, edges);
        addLog(
          `Execution order determined: ${executionOrder.length} node(s)`,
          'info'
        );

        // Step 4: Execute nodes in order
        for (const nodeId of executionOrder) {
          // Find node in current state
          const currentNode = currentNodesState.find((n) => n.id === nodeId);

          if (!currentNode) {
            addLog(`Warning: Node ${nodeId} not found, skipping`, 'info');
            continue;
          }

          const nodeLabel = currentNode.data.label;
          const nodeType = currentNode.data.type;

          // Validate node data
          if (!nodeLabel || !nodeType) {
            addLog(
              `Warning: Node ${nodeId} has missing data (label: ${nodeLabel}, type: ${nodeType}), skipping`,
              'info'
            );
            continue;
          }

          try {
            // Mark node as running
            setNodes((nds) => {
              const updated = nds.map((node) => {
                if (node.id === nodeId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      status: 'running' as NodeStatus,
                    },
                  };
                }
                return node;
              });
              // Update current state reference
              currentNodesState = updated;
              // Force React Flow to detect the change by creating a new array reference
              return [...updated];
            });
            // Small delay to ensure React processes the update
            await new Promise((resolve) => setTimeout(resolve, 50));
            addLog(generateLogMessage(nodeLabel, nodeType, 'started'), 'info');

            // Simulate node execution with delay
            await simulateNodeExecution(nodeId, nodeLabel, 1000);

            // Mark node as completed
            setNodes((nds) => {
              const updated = nds.map((node) => {
                if (node.id === nodeId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      status: 'completed' as NodeStatus,
                    },
                  };
                }
                return node;
              });
              // Update current state reference
              currentNodesState = updated;
              // Force React Flow to detect the change by creating a new array reference
              return [...updated];
            });
            // Small delay to ensure React processes the update
            await new Promise((resolve) => setTimeout(resolve, 50));
            addLog(
              generateLogMessage(nodeLabel, nodeType, 'completed'),
              'success'
            );
          } catch (error) {
            // Mark node as error
            setNodes((nds) => {
              const updated = nds.map((node) => {
                if (node.id === nodeId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      status: 'error' as NodeStatus,
                    },
                  };
                }
                return node;
              });
              // Force React Flow to detect the change by creating a new array reference
              return [...updated];
            });
            addLog(generateLogMessage(nodeLabel, nodeType, 'error'), 'error');
            setExecutionStatus('error');
            setIsExecuting(false);
            return; // Stop execution on error
          }
        }

        // Step 5: Execution completed successfully
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
        setIsExecuting(false);
      }
    },
    [isExecuting, addLog, clearLogs]
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
