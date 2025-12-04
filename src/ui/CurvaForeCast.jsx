import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { buildCurvaS as buildFromUtils } from '../utils/curvaClient'; // already added earlier

// simple forecast: linear projection from planned curve slope
function forecastPlanned(plannedPct, daysAhead = 7) {
  // take last two points slope and extend
  const n = plannedPct.length;
  if (n < 2) return plannedPct;
  const slope = plannedPct[n-1] - plannedPct[n-2];
  const out = [...plannedPct];
  for (let i = 0; i < daysAhead; i++) {
    out.push(Math.min(100, out[out.length - 1] + slope));
  }
  return out;
}

export default function CurvaForecast({ tasks = [], from, to }) {
  const [daysAhead, setDaysAhead] = useState(7);
  const data = useMemo(() => buildFromUtils(tasks, from, to), [tasks, from, to]);

  const forecastedPlanned = useMemo(() => forecastPlanned(data?.planned || [], daysAhead), [data, daysAhead]);

  if (!data) return <div>Loading...</div>;

  const labels = [...data.labels, ...Array.from({length: daysAhead}).map((_,i)=>`+${i+1}`)];

  const chartData = {
    labels,
    datasets: [
      { label: 'Planned (%)', data: [...data.planned, ...Array(daysAhead).fill(null)], borderColor: '#3b82f6', tension: 0.2 },
      { label: 'Planned Forecast', data: [...Array(data.planned.length).fill(null), ...forecastedPlanned.slice(data.planned.length)], borderColor: '#60a5fa', borderDash: [6,4], tension:0.2 },
      { label: 'Actual (%)', data: data.actual, borderColor: '#10b981', tension: 0.2 }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Curva-S</h4>
        <div className="flex items-center gap-2">
          <label className="text-sm">Forecast days</label>
          <input type="number" value={daysAhead} min={1} max={30} onChange={e=>setDaysAhead(Number(e.target.value))} className="border p-1 rounded w-20"/>
        </div>
      </div>

      <Line data={chartData} />
    </div>
  );
}