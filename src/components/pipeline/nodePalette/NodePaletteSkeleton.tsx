export const NodePaletteSkeleton = () => {
  return (
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
  );
};
