import { FC, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface PerformanceChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
  showTrend?: boolean;
}

export const PerformanceChart: FC<PerformanceChartProps> = ({
  data,
  title,
  color = '#3b82f6',
  showTrend = true
}) => {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  const minValue = useMemo(() => Math.min(...data.map(d => d.value), 0), [data]);
  
  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const first = data[0].value;
    const last = data[data.length - 1].value;
    if (!first || first === 0) return 0;
    const calculated = ((last - first) / first) * 100;
    return isNaN(calculated) || !isFinite(calculated) ? 0 : calculated;
  }, [data]);

  const normalizeValue = (value: number) => {
    const range = maxValue - minValue || 1;
    return ((value - minValue) / range) * 100;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {showTrend && data.length > 1 && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            trend >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-bold">
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-white/50 pr-2">
          <span>{maxValue}</span>
          <span>{Math.round((maxValue + minValue) / 2)}</span>
          <span>{minValue}</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-12 right-0 top-0 bottom-8 flex items-end gap-1">
          {data.map((point, index) => {
            const height = normalizeValue(point.value);
            const isLast = index === data.length - 1;
            
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center group relative"
              >
                {/* Bar */}
                <div
                  className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    opacity: isLast ? 1 : 0.7
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {point.label || point.date}: {point.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-white/50">
          {data.length > 0 && (
            <>
              <span>{data[0].date}</span>
              {data.length > 2 && (
                <span>{data[Math.floor(data.length / 2)].date}</span>
              )}
              <span>{data[data.length - 1].date}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {data.length > 0 ? data[data.length - 1].value : 0}
          </div>
          <div className="text-xs text-white/60">Ultimo</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length) || 0}
          </div>
          <div className="text-xs text-white/60">Media</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {maxValue}
          </div>
          <div className="text-xs text-white/60">Massimo</div>
        </div>
      </div>
    </div>
  );
};

