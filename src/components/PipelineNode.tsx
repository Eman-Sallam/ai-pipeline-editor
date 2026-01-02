import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { PipelineNodeData } from '../types/pipeline';
import {
  CircleStackIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/solid';

// Map node types to their icons and colors
const nodeTypeConfig: Record<
  string,
  {
    Icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    iconColor: string;
    borderColor: string;
  }
> = {
  '1': {
    Icon: CircleStackIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-600',
  },
  '2': {
    Icon: Cog6ToothIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-600',
  },
  '3': {
    Icon: SparklesIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-600',
  },
  '4': {
    Icon: ArchiveBoxIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-600',
  },
};

const PipelineNode = ({ data }: NodeProps<PipelineNodeData>) => {
  const config = nodeTypeConfig[data.type] || {
    Icon: Cog6ToothIcon,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600',
    borderColor: 'border-gray-600',
  };
  const { Icon, borderColor } = config;

  return (
    <div
      className={`bg-base-100 rounded-lg shadow-md border-l-4 ${borderColor} min-w-[150px]`}
    >
      {/* Input handle */}
      <Handle
        type='target'
        position={Position.Top}
        className='bg-base-300 border-2 border-base-content'
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
        position={Position.Bottom}
        className='bg-base-300 border-2 border-base-content'
      />
    </div>
  );
};

export default memo(PipelineNode);
