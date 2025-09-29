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
    const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 resize-none';
    const errorClasses = error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
        : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500';

    const classes = `${baseClasses} ${errorClasses} ${className}`;

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <textarea className={classes} {...props} />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-slate-500">{helperText}</p>
            )}
        </div>
    );
}
