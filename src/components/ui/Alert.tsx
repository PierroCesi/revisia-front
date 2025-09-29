import React from 'react';

interface AlertProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'info';
    className?: string;
}

export default function Alert({
    children,
    variant = 'info',
    className = ''
}: AlertProps) {
    const baseClasses = 'p-4 rounded-lg border';

    const variants = {
        success: 'bg-green-soft border-green-200 text-green-700',
        error: 'bg-destructive/10 border-destructive/20 text-destructive',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        info: 'bg-blue-soft border-blue-200 text-blue-700'
    };

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    return (
        <div className={classes}>
            {children}
        </div>
    );
}
