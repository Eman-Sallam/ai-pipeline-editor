import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type ReactFlowInstance,
} from 'reactflow';
import type { Node, Edge, Connection, NodeTypes } from 'reactflow';
import type { PipelineNodeData } from '../../types/pipeline';
import PipelineNode from './PipelineNode.tsx';
import { validateConnection } from '../../graph/validation';
import Toast, { type ToastMessage } from '../shared/Toast';

const nodeTypes: NodeTypes = {
  pipelineNode: PipelineNode,
};

const initialNodes: Node<PipelineNodeData>[] = [];
const initialEdges: Edge[] = [];

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate the connection before adding it
      const validation = validateConnection(params, edges);

      if (!validation.valid) {
        // Show error toast
        setToast({
          id: `toast-${Date.now()}`,
          message: validation.error || 'Invalid connection',
          type: 'error',
        });
        return;
      }

      // Connection is valid, add it
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, edges]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance.current) return;

      const data = e.dataTransfer.getData('application/reactflow');
      if (!data) return;

      try {
        const nodeData = JSON.parse(data);
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: e.clientX - reactFlowBounds.left,
          y: e.clientY - reactFlowBounds.top,
        });

        const newNode: Node<PipelineNodeData> = {
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'pipelineNode',
          position,
          data: {
            label: nodeData.name,
            type: nodeData.type,
            status: 'idle',
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Error parsing dropped node data:', error);
      }
    },
    [setNodes]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className='flex-1 relative overflow-hidden bg-base-100'
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes}
        className='bg-base-100'
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default FlowCanvas;
