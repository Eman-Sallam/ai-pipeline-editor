import { PlayIcon } from '@heroicons/react/24/solid';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { usePipeline } from '../../contexts/PipelineContext';

interface EditorHeaderProps {
  onMenuClick?: () => void;
}

const EditorHeader = ({ onMenuClick }: EditorHeaderProps) => {
  const { executePipeline, isExecuting } = usePipeline();

  const handleExecute = async () => {
    await executePipeline();
  };

  return (
    <header className='bg-base-100 border-b border-base-300 px-4 py-3 flex items-center justify-between shadow-sm'>
      {/* Logo and title */}
      <div className='flex items-center gap-3'>
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className='btn btn-ghost btn-sm md:hidden'
          aria-label='Toggle menu'
        >
          <Bars3Icon className='w-6 h-6' />
        </button>
        <img src='/logo.svg' alt='Logo' className='h-8 w-8' />
        <h1 className='text-lg md:text-xl font-semibold'>AI Pipeline Editor</h1>
      </div>

      {/* Execute button */}
      <button
        onClick={handleExecute}
        disabled={isExecuting}
        className={`btn btn-accent btn-sm flex items-center gap-2 `}
      >
        {isExecuting ? (
          <>
            <span className='loading loading-spinner loading-xs'></span>
            Running...
          </>
        ) : (
          <>
            <PlayIcon className='w-4 h-4' />
            Execute
          </>
        )}
      </button>
    </header>
  );
};

export default EditorHeader;
