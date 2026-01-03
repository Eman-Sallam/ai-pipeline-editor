import { useState, useEffect } from 'react';
import {
  CircleStackIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { fetchNodeTypes, ApiError } from '../../api/nodesApi';
import type { ApiNodeType } from '../../types/pipeline';
import Toast, { type ToastMessage } from '../shared/Toast';

// Mapping configuration for node types
const NODE_TYPE_CONFIG: Record<
  string,
  {
    Icon: typeof CircleStackIcon;
    bgColor: string;
    iconColor: string;
    borderColor: string;
    description: string;
  }
> = {
  'Data Source': {
    Icon: CircleStackIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-600',
    description: 'Import data from various sources',
  },
  Transformer: {
    Icon: Cog6ToothIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-600',
    description: 'Transform and process data',
  },
  Model: {
    Icon: SparklesIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-600',
    description: 'Machine learning models',
  },
  Sink: {
    Icon: ArchiveBoxIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-600',
    description: 'Export data to destinations',
  },
};

// Default config for unknown node types
const DEFAULT_CONFIG = {
  Icon: CircleStackIcon,
  bgColor: 'bg-gray-100',
  iconColor: 'text-gray-600',
  borderColor: 'border-gray-600',
  description: 'Node type',
};

// Map API response to UI format
type NodeTypeWithUI = {
  id: string;
  name: string;
  Icon: typeof CircleStackIcon;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  description: string;
};

function mapApiNodeToUI(apiNode: ApiNodeType): NodeTypeWithUI {
  const config = NODE_TYPE_CONFIG[apiNode.name] || DEFAULT_CONFIG;
  return {
    id: apiNode.id,
    name: apiNode.name,
    ...config,
  };
}

const NodePalette = () => {
  const [nodeTypes, setNodeTypes] = useState<NodeTypeWithUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadNodeTypes = async () => {
    setIsLoading(true);
    setError(null);
    setToast(null);
    try {
      const apiNodes = await fetchNodeTypes();
      const mappedNodes = apiNodes.map(mapApiNodeToUI);
      setNodeTypes(mappedNodes);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Failed to load node types. Please try again.';
      setError(errorMessage);
      setToast({
        id: `error-${Date.now()}`,
        message: errorMessage,
        type: 'error',
        action: {
          label: 'Retry',
          onClick: handleRetry,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToast(null);
  };

  const handleRetry = () => {
    loadNodeTypes();
  };

  useEffect(() => {
    loadNodeTypes();
  }, []);

  return (
    <>
      <Toast message={toast} onClose={handleToastClose} duration={7000} />
      <aside className='w-[250px] bg-base-200 border-r border-base-300 overflow-y-auto h-full'>
        <div className='p-4'>
          <h2 className='text-lg font-semibold mb-4'>Node Palette</h2>
          <div className='space-y-2'>
            {/* Node types list */}
            <div className='space-y-2'>
              {isLoading && (
                <>
                  {/* Skeleton placeholders matching the node card structure */}
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className='card card-compact bg-base-100 shadow-sm border-l-4 border-base-300'
                    >
                      <div className='card-body p-3'>
                        <div className='flex items-center gap-3'>
                          {/* Icon skeleton */}
                          <div className='skeleton h-10 w-10 shrink-0 rounded-lg'></div>
                          {/* Text skeletons */}
                          <div className='flex-1 min-w-0 space-y-2'>
                            <div className='skeleton h-4 w-20'></div>
                            <div className='skeleton h-3 w-12'></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!isLoading && error && (
                <div className='flex flex-col items-center justify-center py-8 gap-3'>
                  <p className='text-sm text-base-content/60 text-center'>
                    Failed to load nodes
                  </p>
                  <button
                    className='btn btn-sm btn-ghost'
                    onClick={handleRetry}
                    title='Retry loading nodes'
                  >
                    <ArrowPathIcon className='w-4 h-4' />
                    Retry
                  </button>
                </div>
              )}

              {!isLoading && !error && nodeTypes.length === 0 && (
                <div className='text-center py-8 text-base-content/60'>
                  <p className='text-sm'>No node types available</p>
                </div>
              )}

              {!isLoading &&
                !error &&
                nodeTypes.map((node) => (
                  <div
                    key={node.id}
                    className={`card card-compact bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-move border-l-4 ${node.borderColor}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'application/reactflow',
                        JSON.stringify({
                          type: String(node.id),
                          name: node.name,
                        })
                      );
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <div className='card-body p-3'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2 rounded-lg ${node.bgColor} flex items-center justify-center`}
                        >
                          <node.Icon className={`w-6 h-6 ${node.iconColor}`} />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-sm truncate'>
                            {node.name}
                          </h3>
                          <p className='text-xs text-base-content/60'>
                            #{node.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NodePalette;
