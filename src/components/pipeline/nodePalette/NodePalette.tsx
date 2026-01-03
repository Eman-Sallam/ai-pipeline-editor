import { useState, useEffect } from 'react';
import { fetchNodeTypes, ApiError } from '../../../api/nodesApi';
import Toast, { type ToastMessage } from '../../shared/Toast';
import { mapApiNodeToUI, type NodeTypeWithUI } from './nodeTypeConfig';
import { NodePaletteSkeleton } from './NodePaletteSkeleton';
import { NodePaletteError } from './NodePaletteError';
import { NodeTypeCard } from './NodeTypeCard';

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
              {isLoading && <NodePaletteSkeleton />}

              {!isLoading && error && (
                <NodePaletteError onRetry={handleRetry} />
              )}

              {!isLoading && !error && nodeTypes.length === 0 && (
                <div className='text-center py-8 text-base-content/60'>
                  <p className='text-sm'>No node types available</p>
                </div>
              )}

              {!isLoading &&
                !error &&
                nodeTypes.map((node) => (
                  <NodeTypeCard key={node.id} node={node} />
                ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NodePalette;
