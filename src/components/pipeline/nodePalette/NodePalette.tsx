import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { fetchNodeTypes, ApiError } from '../../../api/nodesApi';
import Toast, { type ToastMessage } from '../../shared/Toast';
import { mapApiNodeToUI, type NodeTypeWithUI } from './nodeTypeConfig';
import { NodePaletteSkeleton } from './NodePaletteSkeleton';
import { NodePaletteError } from './NodePaletteError';
import { NodeTypeCard } from './NodeTypeCard';

interface NodePaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NodePalette = ({ isOpen = true, onClose }: NodePaletteProps) => {
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
      {/* Sidebar/Drawer */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-[250px] bg-base-200 border-r border-base-300 overflow-y-auto h-full transition-transform duration-300 ease-in-out shadow-lg md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Node Palette</h2>
            {onClose && (
              <button
                onClick={onClose}
                className='btn btn-ghost btn-sm btn-square md:hidden'
                aria-label='Close menu'
              >
                <XMarkIcon className='w-5 h-5' />
              </button>
            )}
          </div>
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
