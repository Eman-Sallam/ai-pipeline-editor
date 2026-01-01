import { PlayIcon } from '@heroicons/react/24/solid';

const EditorHeader = () => {
  const handleExecute = () => {
    // TODO: Implement execute functionality
    console.log('Execute clicked');
  };

  return (
    <header className='bg-base-100 border-b border-base-300 px-4 py-3 flex items-center justify-between shadow-sm'>
      {/* Logo and title */}
      <div className='flex items-center gap-3'>
        <img src='/logo.svg' alt='Logo' className='h-8 w-8' />
        <h1 className='text-xl font-semibold'>AI Pipeline Editor</h1>
      </div>

      {/* Execute button */}
      <button
        onClick={handleExecute}
        className='btn btn-accent btn-sm flex items-center gap-2'
      >
        <PlayIcon className='w-4 h-4' />
        Execute
      </button>
    </header>
  );
};

export default EditorHeader;
