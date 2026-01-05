import type { NodeTypeWithUI } from './nodeTypeConfig';

interface NodeTypeCardProps {
  node: NodeTypeWithUI;
}

export const NodeTypeCard = ({ node }: NodeTypeCardProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({
        type: node.name, // Use name (e.g., "Data Source") not ID for log templates
        name: node.name,
        id: node.id, // Keep ID for reference if needed
      })
    );
    e.dataTransfer.effectAllowed = 'move';
    // Prevent default to allow drag on mobile
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div
      className={`card card-compact bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-move border-l-4 ${node.borderColor} touch-none`}
      draggable
      onDragStart={handleDragStart}
      style={{ touchAction: 'none' }}
    >
      <div className='card-body p-3'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-2 rounded-lg ${node.bgColor} flex items-center justify-center`}
          >
            <node.Icon className={`w-6 h-6 ${node.iconColor}`} />
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-sm truncate'>{node.name}</h3>
            <p className='text-xs text-base-content/60'>#{node.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
