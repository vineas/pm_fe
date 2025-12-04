import React, { useMemo } from 'react';
import { differenceInCalendarDays, parseISO, addDays, format } from 'date-fns';

// helper to compute timeline range
function getRange(tasks) {
  if (!tasks || tasks.length === 0) {
    const today = new Date();
    return { start: today, end: addDays(today, 7) };
  }
  const starts = tasks.map(t => parseISO(t.start_date));
  const ends = tasks.map(t => parseISO(t.due_date));
  const min = new Date(Math.min(...starts));
  const max = new Date(Math.max(...ends));
  return { start: min, end: max };
}

export default function GanttHorizontal({ tasks = [], mode = 'daily' }) {
  const { start, end } = useMemo(() => getRange(tasks), [tasks]);
  const totalDays = differenceInCalendarDays(end, start) + 1;
  const days = Array.from({ length: totalDays }).map((_, i) => addDays(start, i));

  return (
    <div className="overflow-auto border rounded p-2">
      <div className="min-w-max">
        {/* header timeline */}
        <div className="flex">
          <div className="w-64 pr-4"></div>
          <div className="flex flex-nowrap">
            {days.map(d => (
              <div key={d.toISOString()} className="px-2 border-l border-gray-200 text-xs text-center min-w-[48px]">
                {format(d, 'MM-dd')}
              </div>
            ))}
          </div>
        </div>

        {/* rows */}
        {tasks.map(task => {
          const s = parseISO(task.start_date);
          const e = parseISO(task.due_date);
          const offset = differenceInCalendarDays(s, start);
          const dur = differenceInCalendarDays(e, s) + 1;
          const leftPercent = (offset / totalDays) * 100;
          const widthPercent = (dur / totalDays) * 100;

          const color = task.status === 'done' ? 'bg-green-500' : task.status === 'inprogress' ? 'bg-yellow-500' : 'bg-blue-500';

          return (
            <div className="flex items-center py-2" key={task.id}>
              <div className="w-64 pr-4">
                <div className="font-medium">{task.name}</div>
                <div className="text-xs text-gray-500">{task.bobot} pts</div>
              </div>

              <div className="flex-1 relative h-10">
                <div className="absolute inset-0 bg-transparent">
                  {/* grid background optional */}
                </div>
                <div
                  className={`absolute top-2 h-6 rounded ${color} text-white flex items-center px-2 text-xs`}
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    minWidth: '40px'
                  }}
                >
                  <span>{task.progress ?? (task.status === 'done' ? '100%' : task.status === 'inprogress' ? '50%' : '0%')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}