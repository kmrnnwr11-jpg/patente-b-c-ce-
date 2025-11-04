import { FC } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp } from 'lucide-react';

interface ProgressData {
  date: string;
  quizzes: number;
  correctRate: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
}

export const ProgressChart: FC<ProgressChartProps> = ({ 
  data, 
  title = "Progressi Ultimi 7 Giorni" 
}) => {
  // Calcola il massimo per scalare il grafico
  const maxQuizzes = Math.max(...data.map(d => d.quizzes), 1);

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {title}
        </h3>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const quizHeight = (item.quizzes / maxQuizzes) * 100;
          const correctHeight = item.correctRate;

          return (
            <div key={index} className="space-y-2">
              {/* Date Label */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">{item.date}</span>
                <div className="flex items-center gap-4">
                  <span className="text-white/60">
                    {item.quizzes} quiz
                  </span>
                  <span className={`font-bold ${
                    item.correctRate >= 80 ? 'text-green-400' :
                    item.correctRate >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {item.correctRate}%
                  </span>
                </div>
              </div>

              {/* Bars */}
              <div className="flex gap-2 h-8">
                {/* Quiz Count Bar */}
                <div className="flex-1 bg-white/10 rounded-lg overflow-hidden relative">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-lg transition-all duration-500"
                    style={{ width: `${quizHeight}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

                {/* Correct Rate Bar */}
                <div className="flex-1 bg-white/10 rounded-lg overflow-hidden relative">
                  <div 
                    className={`h-full rounded-lg transition-all duration-500 ${
                      item.correctRate >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      item.correctRate >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}
                    style={{ width: `${correctHeight}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <span className="text-white/70 text-sm">Quiz Fatti</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <span className="text-white/70 text-sm">% Corrette</span>
        </div>
      </div>

      {/* Summary */}
      {data.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-white/60 text-xs mb-1">Totale Quiz</p>
              <p className="text-white font-bold text-lg">
                {data.reduce((sum, d) => sum + d.quizzes, 0)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Media Corrette</p>
              <p className="text-white font-bold text-lg">
                {Math.round(data.reduce((sum, d) => sum + d.correctRate, 0) / data.length)}%
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Miglioramento</p>
              <p className="text-green-400 font-bold text-lg">
                +{Math.round((data[data.length - 1]?.correctRate || 0) - (data[0]?.correctRate || 0))}%
              </p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

