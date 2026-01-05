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

  // Group logs by execution (each execution gets its own ul list)
  // Since logs are prepended (newest first), reverse to process chronologically
  const reversedLogs = [...logs].reverse();
  const groupedExecutions = reversedLogs.reduce((acc, entry) => {
    // Check if this is the start of a new execution
    if (entry.message === 'Pipeline execution started') {
      // Start a new execution group
      acc.push([
        {
          time: entry.timestamp,
          message: entry.message,
          type: entry.type || 'info',
        },
      ]);
    } else {
      // Add log to the current (most recent) execution group
      if (acc.length > 0) {
        acc[acc.length - 1].push({
          time: entry.timestamp,
          message: entry.message,
          type: entry.type || 'info',
        });
      } else {
        // If no execution start found yet, create first group
        acc.push([
          {
            time: entry.timestamp,
            message: entry.message,
            type: entry.type || 'info',
          },
        ]);
      }
    }
    return acc;
  }, [] as Array<Array<{ time: string; message: string; type: string }>>);
  // Reverse to show newest executions first, and reverse each group to show newest logs first
  const groupedExecutionsReversed = groupedExecutions
    .reverse()
    .map((execution) => execution.reverse());

  return (
    <aside className='w-full md:w-[250px] bg-base-200 border-r md:border-r-0 md:border-l border-base-300 h-[180px] md:h-full flex flex-col shrink-0'>
      <div className='p-2 md:p-4 border-b border-base-300'>
        <div className='flex items-center justify-between gap-2'>
          <h2 className='text-sm md:text-lg font-semibold'>Execution Log</h2>
          <button
            onClick={clearLogs}
            className='btn btn-ghost btn-xs text-xs'
            disabled={logs.length === 0}
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Log entries container with scroll */}
      <div ref={logContainerRef} className='flex-1 overflow-y-auto p-2 md:p-4'>
        {logs.length === 0 ? (
          <div className='text-center text-base-content/50 text-sm py-8'>
            No logs yet. Execute the pipeline to see logs here.
          </div>
        ) : (
          <div className='space-y-4'>
            {groupedExecutionsReversed.map((execution, executionIndex) => (
              <ul
                key={executionIndex}
                className='list bg-base-100 rounded-box shadow-sm border border-base-300'
              >
                {execution.map((entry, entryIndex) => (
                  <li
                    key={entryIndex}
                    className={`p-2 ${
                      entryIndex < execution.length - 1
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
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ExecutionLog;
