"use client";

import { useState, useEffect } from 'react';
import { Button, Card, Typography, ErrorAlert } from '@/components/ui';
import { Edit3, X } from 'lucide-react';

interface RenameLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newTitle: string) => Promise<void>;
    currentTitle: string;
    isLoading?: boolean;
}

export default function RenameLessonModal({
    isOpen,
    onClose,
    onConfirm,
    currentTitle,
    isLoading = false
}: RenameLessonModalProps) {
    const [newTitle, setNewTitle] = useState(currentTitle);
    const [error, setError] = useState<string | null>(null);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setNewTitle(currentTitle);
            setError(null);
        }
    }, [isOpen, currentTitle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!newTitle.trim()) {
            setError('Le titre ne peut pas être vide');
            return;
        }

        if (newTitle.trim() === currentTitle) {
            onClose();
            return;
        }

        if (newTitle.length > 255) {
            setError('Le titre ne peut pas dépasser 255 caractères');
            return;
        }

        try {
            setError(null);
            await onConfirm(newTitle.trim());
        } catch (err) {
            console.error('Erreur lors du renommage:', err);
            setError('Erreur lors du renommage de la leçon');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="widget-card p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-soft rounded-xl flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-orange-700" />
                        </div>
                        <Typography variant="h4" className="font-bold text-foreground">
                            Renommer la leçon
                        </Typography>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="lesson-title" className="block text-sm font-medium text-foreground mb-2">
                            Nouveau titre
                        </label>
                        <input
                            id="lesson-title"
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            placeholder="Entrez le nouveau titre..."
                            maxLength={255}
                            disabled={isLoading}
                            autoFocus
                        />
                        <div className="flex justify-between items-center mt-1">
                            <Typography variant="caption" color="muted">
                                {newTitle.length}/255 caractères
                            </Typography>
                        </div>
                    </div>

                    {error && (
                        <ErrorAlert
                            message={error}
                            onDismiss={() => setError(null)}
                        />
                    )}

                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !newTitle.trim() || newTitle.trim() === currentTitle}
                            className="flex-1 bg-orange-primary text-white hover:bg-orange-700"
                        >
                            {isLoading ? 'Renommage...' : 'Renommer'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
