const NodePalette = () => {
  const nodeTypes = [
    {
      id: 1,
      name: 'Data Source',
      icon: '📊',
      bgColor: 'bg-blue-100',
      description: 'Import data from various sources',
    },
    {
      id: 2,
      name: 'Transformer',
      icon: '⚙️',
      bgColor: 'bg-orange-100',
      description: 'Transform and process data',
    },
    {
      id: 3,
      name: 'Model',
      icon: '⭐',
      bgColor: 'bg-purple-100',
      description: 'Machine learning models',
    },
    {
      id: 4,
      name: 'Sink',
      icon: '💾',
      bgColor: 'bg-green-100',
      description: 'Export data to destinations',
    },
  ];

  return (
    <aside className='w-[250px] bg-base-200 border-r border-base-300 overflow-y-auto h-full'>
      <div className='p-4'>
        <h2 className='text-lg font-semibold mb-4'>Node Palette</h2>
        <div className='space-y-2'>
          {/* Search bar */}
          <div className='relative'>
            <input
              type='text'
              placeholder='Search...'
              className='input input-bordered input-sm w-full pl-9'
            />
            <svg
              className='absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>

          {/* Node types list */}
          <div className='mt-4 space-y-2'>
            {nodeTypes.map((node) => (
              <div
                key={node.id}
                className='card card-compact bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-move border border-base-300'
                draggable
              >
                <div className='card-body p-3'>
                  <div className='flex items-center gap-3'>
                    <div className={`text-2xl p-2 rounded-lg ${node.bgColor}`}>
                      {node.icon}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-sm truncate'>
                        {node.name}
                      </h3>
                      <p className='text-xs text-base-content/60'>#{node.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default NodePalette;
