import React from 'react';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectOptGroup {
    label: string;
    options: SelectOption[];
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options?: SelectOption[];
    optGroups?: SelectOptGroup[];
    placeholder?: string;
}

export default function Select({
    label,
    error,
    helperText,
    className = '',
    options = [],
    optGroups = [],
    placeholder,
    ...props
}: SelectProps) {
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
            <select className={classes} {...props}>
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {/* Options simples */}
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}

                {/* Groupes d'options */}
                {optGroups.map((group, groupIndex) => (
                    <optgroup key={groupIndex} label={group.label}>
                        {group.options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
}




