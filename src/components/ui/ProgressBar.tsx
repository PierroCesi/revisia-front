import React from 'react';

interface ProgressBarProps {
    progress: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    color?: 'emerald' | 'blue' | 'purple' | 'orange';
    className?: string;
}

export default function ProgressBar({
    progress,
    size = 'md',
    color = 'emerald',
    className = ''
}: ProgressBarProps) {
    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };

    const colors = {
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500'
    };

    const baseClasses = 'w-full bg-slate-200 rounded-full overflow-hidden';
    const barClasses = `${sizes[size]} ${colors[color]} transition-all duration-300 ease-out`;

    return (
        <div className={`${baseClasses} ${className}`}>
            <div
                className={barClasses}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
        </div>
    );
}
