import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { PipelineNodeData } from '../../types/pipeline';
import { NODE_TYPE_CONFIG, DEFAULT_CONFIG } from './nodePalette/nodeTypeConfig';

// Map node types to their icons and colors using the same config as NodePalette
const nodeTypeConfig = NODE_TYPE_CONFIG;

const PipelineNode = ({ data, selected }: NodeProps<PipelineNodeData>) => {
  // Use node type name (e.g., "Data Source") to get config, fallback to default
  const config = nodeTypeConfig[data.type] || DEFAULT_CONFIG;
  const { Icon, borderColor } = config;

  return (
    <div
      className={`bg-base-100 rounded-lg border-l-4 ${borderColor} min-w-[150px] transition-all ${
        selected
          ? 'shadow-xl ring-1 ring-gray-400'
          : 'shadow-md hover:shadow-lg'
      }`}
    >
      {/* Input handle */}
      <Handle
        type='target'
        position={Position.Left}
        style={{
          backgroundColor: '#9ca3af',
          border: '2px solid #4b5563',
          width: '8px',
          height: '8px',
        }}
      />

      {/* Node content */}
      <div className='p-3'>
        <div className='flex items-center gap-2 mb-2'>
          <div
            className={`p-1.5 rounded-lg ${config.bgColor} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='font-semibold text-sm truncate'>{data.label}</div>
            <div className='text-xs text-base-content/60'>#{data.type}</div>
          </div>
        </div>

        {/* Status indicator */}
        <div className='flex items-center gap-1.5 mt-2'>
          <div
            className={`w-2 h-2 rounded-full ${
              data.status === 'idle'
                ? 'bg-base-300'
                : data.status === 'running'
                ? 'bg-blue-500 animate-pulse'
                : data.status === 'completed'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          />
          <span className='text-xs text-base-content/70 capitalize'>
            {data.status}
          </span>
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type='source'
        position={Position.Right}
        style={{
          backgroundColor: '#9ca3af',
          border: '2px solid #4b5563',
          width: '8px',
          height: '8px',
        }}
      />
    </div>
  );
};

export default memo(PipelineNode);
