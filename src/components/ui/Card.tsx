import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
    shadow?: 'sm' | 'md' | 'lg' | 'none';
}

export default function Card({
    children,
    className = '',
    padding = 'md',
    shadow = 'md',
    ...props
}: CardProps) {
    const baseClasses = 'bg-card rounded-xl border border-border';

    const paddings = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const shadows = {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        none: ''
    };

    const classes = `${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${className}`;

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}
