// components/ui/AlertDialog.tsx
import React from 'react';
import { Button, Card, Typography } from './index';
import { AlertTriangle, X } from 'lucide-react';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    isLoading?: boolean;
}

export default function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'default',
    isLoading = false
}: AlertDialogProps) {
    if (!isOpen) return null;

    const isDestructive = variant === 'destructive';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <Card className="widget-card max-w-md w-full p-6 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDestructive ? 'bg-red-100' : 'bg-orange-soft'
                            }`}>
                            <AlertTriangle className={`w-5 h-5 ${isDestructive ? 'text-red-600' : 'text-orange-700'
                                }`} />
                        </div>
                        <div>
                            <Typography variant="h5" className={`font-bold ${isDestructive ? 'text-red-900' : 'text-foreground'
                                }`}>
                                {title}
                            </Typography>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-2"
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-6">
                    <Typography variant="body" color="muted" className="leading-relaxed">
                        {description}
                    </Typography>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="min-w-[100px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDestructive ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="min-w-[100px]"
                    >
                        {isLoading ? 'Suppression...' : confirmText}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

