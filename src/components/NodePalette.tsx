import {
  CircleStackIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/solid';

const NodePalette = () => {
  const nodeTypes = [
    {
      id: 1,
      name: 'Data Source',
      Icon: CircleStackIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-600',
      description: 'Import data from various sources',
    },
    {
      id: 2,
      name: 'Transformer',
      Icon: Cog6ToothIcon,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-600',
      description: 'Transform and process data',
    },
    {
      id: 3,
      name: 'Model',
      Icon: SparklesIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-600',
      description: 'Machine learning models',
    },
    {
      id: 4,
      name: 'Sink',
      Icon: ArchiveBoxIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-green-600',
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
