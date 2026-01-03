const ExecutionLog = () => {
  const handleClearLogs = () => {
    // TODO: Implement clear logs functionality
    console.log('Clear logs clicked');
  };

  // Sample log entries - will be replaced with real data later
  const logEntries = [
    {
      date: '2024-01-15',
      time: '14:24:12',
      message: 'Input Data processed 100 records',
    },
    {
      date: '2024-01-15',
      time: '14:24:13',
      message: 'Feature Scaling applied',
    },
    {
      date: '2024-01-15',
      time: '14:24:15',
      message: 'Predictor generated predictions',
    },
    { date: '2024-01-15', time: '14:24:16', message: 'Database saved results' },
  ];

  // Group logs by date
  const groupedLogs = logEntries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, typeof logEntries>);

  return (
    <aside className='w-[250px] bg-base-200 border-r md:border-r-0 md:border-l border-base-300 overflow-y-auto h-full'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Execution Log</h2>
          <button onClick={handleClearLogs} className='btn btn-ghost btn-xs'>
            Clear Logs
          </button>
        </div>

        {/* Log entries grouped by date */}
        <div className='space-y-4'>
          {Object.entries(groupedLogs).map(([date, entries]) => (
            <div key={date}>
              {/* Date header */}
              <div className='p-2 pb-1 text-xs opacity-60 tracking-wide font-semibold mb-2'>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              {/* List of log entries for this date */}
              <ul className='list bg-base-100 rounded-box shadow-sm border border-base-300'>
                {entries.map((entry, index) => (
                  <li
                    key={index}
                    className={`p-2 ${
                      index < entries.length - 1
                        ? 'border-b border-base-300'
                        : ''
                    }`}
                  >
                    <div className='flex flex-col gap-1'>
                      <span className='text-[10px] font-mono text-base-content/50'>
                        {entry.time}
                      </span>
                      <span className='text-[12px] text-base-content'>
                        {entry.message}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ExecutionLog;
