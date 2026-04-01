import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'blue', className }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className={cn('bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <p className={cn('text-xs mt-1 font-medium', trend.positive ? 'text-green-600' : 'text-red-500')}>
              {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2.5 rounded-lg border flex-shrink-0', colorMap[color])}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}