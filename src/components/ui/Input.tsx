import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export default function Input({
    label,
    error,
    helperText,
    className = '',
    ...props
}: InputProps) {
    const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 bg-background text-foreground';
    const errorClasses = error
        ? 'border-destructive focus:border-destructive focus:ring-destructive'
        : 'border-input focus:border-orange-500 focus:ring-orange-500';

    const classes = `${baseClasses} ${errorClasses} ${className}`;

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <input className={classes} {...props} />
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
}
