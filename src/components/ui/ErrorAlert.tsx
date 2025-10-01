import React from 'react';
import { Button, Card, Typography } from './index';
import { AlertTriangle } from 'lucide-react';

interface ErrorAlertProps {
    message?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export default function ErrorAlert({
    message = "La requête a échoué. Veuillez réessayer ou contacter un administrateur.",
    onRetry,
    onDismiss
}: ErrorAlertProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md w-full mx-4">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>

                    <div>
                        <Typography variant="h6" className="font-semibold text-gray-900 mb-2">
                            Erreur
                        </Typography>
                        <Typography variant="body" className="text-gray-600">
                            {message}
                        </Typography>
                    </div>

                    <div className="flex space-x-3 justify-center">
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                variant="primary"
                            >
                                Réessayer
                            </Button>
                        )}
                        {onDismiss && (
                            <Button
                                onClick={onDismiss}
                                variant="outline"
                            >
                                Fermer
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
