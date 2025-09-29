import React from 'react';

interface TypographyProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'small';
    color?: 'primary' | 'secondary' | 'muted' | 'success' | 'error' | 'warning';
    className?: string;
}

export default function Typography({
    children,
    variant = 'body',
    color = 'primary',
    className = ''
}: TypographyProps) {
    const variants = {
        h1: 'text-4xl md:text-5xl font-bold tracking-tight',
        h2: 'text-3xl md:text-4xl font-bold tracking-tight',
        h3: 'text-2xl md:text-3xl font-semibold',
        h4: 'text-xl md:text-2xl font-semibold',
        h5: 'text-lg md:text-xl font-medium',
        h6: 'text-base md:text-lg font-medium',
        body: 'text-base leading-relaxed',
        caption: 'text-sm',
        small: 'text-xs'
    };

    const colors = {
        primary: 'text-slate-900',
        secondary: 'text-slate-600',
        muted: 'text-slate-500',
        success: 'text-emerald-600',
        error: 'text-red-600',
        warning: 'text-amber-600'
    };

    const classes = `${variants[variant]} ${colors[color]} ${className}`;

    const Component = variant.startsWith('h') ? variant as keyof React.JSX.IntrinsicElements : 'p';

    return (
        <Component className={classes}>
            {children}
        </Component>
    );
}
