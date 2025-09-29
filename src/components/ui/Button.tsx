import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-orange-primary text-white hover:bg-orange-700 focus:ring-orange-500 shadow-lg hover:shadow-xl transition-all',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-slate-500',
        outline: 'border border-border bg-background text-foreground hover:bg-accent focus:ring-slate-500',
        ghost: 'text-foreground hover:bg-accent focus:ring-slate-500',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
