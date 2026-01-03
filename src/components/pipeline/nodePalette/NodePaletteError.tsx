import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface NodePaletteErrorProps {
  onRetry: () => void;
}

export const NodePaletteError = ({ onRetry }: NodePaletteErrorProps) => {
  return (
    <div className='flex flex-col items-center justify-center py-8 gap-3'>
      <p className='text-sm text-base-content/60 text-center'>
        Failed to load nodes
      </p>
      <button
        className='btn btn-sm btn-ghost'
        onClick={onRetry}
        title='Retry loading nodes'
      >
        <ArrowPathIcon className='w-4 h-4' />
        Retry
      </button>
    </div>
  );
};
