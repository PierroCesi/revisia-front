import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
    size?: 'sm' | 'md';
    className?: string;
}

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}: BadgeProps) {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    const variants = {
        default: 'bg-secondary text-secondary-foreground',
        success: 'bg-green-soft text-green-700',
        warning: 'bg-amber-100 text-amber-800',
        error: 'bg-destructive/10 text-destructive',
        info: 'bg-blue-soft text-blue-700',
        secondary: 'bg-secondary text-secondary-foreground'
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <span className={classes}>
            {children}
        </span>
    );
}
