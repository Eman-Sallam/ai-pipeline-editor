import { useEffect, useRef } from 'react';
import { usePipeline } from '../../contexts/PipelineContext';

const ExecutionLog = () => {
  const { logs, clearLogs } = usePipeline();
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  // Group logs by date
  const groupedLogs = logs.reduce((acc, entry) => {
    const today = new Date().toISOString().split('T')[0];
    const date = today; // For simplicity, group all logs under today's date
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      time: entry.timestamp,
      message: entry.message,
      type: entry.type || 'info',
    });
    return acc;
  }, {} as Record<string, Array<{ time: string; message: string; type: string }>>);

  return (
    <aside className='w-[250px] bg-base-200 border-r md:border-r-0 md:border-l border-base-300 h-full flex flex-col'>
      <div className='p-4 border-b border-base-300'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Execution Log</h2>
          <button
            onClick={clearLogs}
            className='btn btn-ghost btn-xs'
            disabled={logs.length === 0}
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Log entries container with scroll */}
      <div ref={logContainerRef} className='flex-1 overflow-y-auto p-4'>
        {logs.length === 0 ? (
          <div className='text-center text-base-content/50 text-sm py-8'>
            No logs yet. Execute the pipeline to see logs here.
          </div>
        ) : (
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
                      } ${
                        entry.type === 'error'
                          ? 'bg-error/10'
                          : entry.type === 'success'
                          ? 'bg-success/10'
                          : ''
                      }`}
                    >
                      <div className='flex flex-col gap-1'>
                        <span className='text-[10px] font-mono text-base-content/50'>
                          {entry.time}
                        </span>
                        <span
                          className={`text-[12px] font-mono ${
                            entry.type === 'error'
                              ? 'text-error'
                              : entry.type === 'success'
                              ? 'text-success'
                              : 'text-base-content'
                          }`}
                        >
                          {entry.message}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ExecutionLog;
