const ExecutionLog = () => {
  const handleClearLogs = () => {
    // TODO: Implement clear logs functionality
    console.log('Clear logs clicked');
  };

  // Sample log entries - will be replaced with real data later
  const logEntries = [
    { time: '14:24:12', message: 'Input Data processed 100 records' },
    { time: '14:24:13', message: 'Feature Scaling applied' },
    { time: '14:24:15', message: 'Predictor generated predictions' },
    { time: '14:24:16', message: 'Database saved results' },
  ];

  return (
    <aside className='w-[300px] bg-base-200 border-l border-base-300 overflow-y-auto h-full'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Execution Log</h2>
          <button onClick={handleClearLogs} className='btn btn-ghost btn-xs'>
            Clear Logs
          </button>
        </div>

        {/* Log entries */}
        <div className='space-y-2'>
          {logEntries.map((entry, index) => (
            <div
              key={index}
              className='card card-compact bg-base-100 shadow-sm border border-base-300'
            >
              <div className='card-body p-3'>
                <div className='flex items-start gap-2'>
                  <span className='text-xs font-mono text-base-content/60 min-w-[60px]'>
                    {entry.time}
                  </span>
                  <span className='text-sm text-base-content flex-1'>
                    {entry.message}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ExecutionLog;
