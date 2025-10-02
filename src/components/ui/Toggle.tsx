import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Toggle({
    checked,
    onChange,
    label,
    disabled = false,
    size = 'md',
    className = ''
}: ToggleProps) {
    const sizes = {
        sm: 'h-4 w-7',
        md: 'h-6 w-11',
        lg: 'h-8 w-14'
    };

    const thumbSizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-6 w-6'
    };

    const translateSizes = {
        sm: 'translate-x-3',
        md: 'translate-x-5',
        lg: 'translate-x-6'
    };

    const baseClasses = `relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${sizes[size]} ${className}`;
    const checkedClasses = checked
        ? 'bg-orange-600'
        : 'bg-gray-200';
    const disabledClasses = disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'cursor-pointer';

    const thumbClasses = `inline-block transform rounded-full bg-white transition-transform ${thumbSizes[size]} ${checked ? translateSizes[size] : 'translate-x-1'
        }`;

    return (
        <div className="flex items-center space-x-3">
            <button
                type="button"
                className={`${baseClasses} ${checkedClasses} ${disabledClasses}`}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                role="switch"
                aria-checked={checked}
            >
                <span className={thumbClasses} />
            </button>
            {label && (
                <label className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
        </div>
    );
}






