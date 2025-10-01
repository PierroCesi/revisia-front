import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export default function Textarea({
    label,
    error,
    helperText,
    className = '',
    ...props
}: TextareaProps) {
    const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 bg-background text-foreground resize-none';
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
            <textarea className={classes} {...props} />
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
}
