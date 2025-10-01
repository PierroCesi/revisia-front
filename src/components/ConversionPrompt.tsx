'use client';

import { Button, Card, Typography } from '@/components/ui';
import { Crown, UserPlus, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

interface ConversionPromptProps {
    type: 'guest_to_free' | 'free_to_premium';
    onClose?: () => void;
}

export default function ConversionPrompt({ type, onClose }: ConversionPromptProps) {
    if (type === 'guest_to_free') {
        return (
            <Card className="widget-card p-6 border-orange-200 bg-orange-50">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>

                    <div>
                        <Typography variant="h4" className="font-bold text-orange-800 mb-2">
                            🎉 Quiz généré avec succès !
                        </Typography>
                        <Typography variant="body" className="text-orange-700">
                            Inscrivez-vous gratuitement pour sauvegarder vos résultats et créer plus de quiz !
                        </Typography>
                    </div>

                    <div className="space-y-2 text-sm text-orange-600">
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Sauvegarde de vos quiz</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>1 quiz par jour (6 questions max)</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Historique de vos performances</span>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Continuer en mode test
                        </Button>
                        <Link href="/register" className="flex-1">
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                S&apos;inscrire gratuitement
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        );
    }

    if (type === 'free_to_premium') {
        return (
            <Card className="widget-card p-6 border-purple-200 bg-purple-50">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                        <Crown className="w-8 h-8 text-white" />
                    </div>

                    <div>
                        <Typography variant="h4" className="font-bold text-purple-800 mb-2">
                            🚀 Passez à Premium !
                        </Typography>
                        <Typography variant="body" className="text-purple-700">
                            Débloquez toutes les fonctionnalités avec un accès illimité
                        </Typography>
                    </div>

                    <div className="space-y-2 text-sm text-purple-600">
                        <div className="flex items-center justify-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Quiz illimités</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Questions illimitées</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Tentatives illimitées</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Fonctionnalités avancées</span>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Plus tard
                        </Button>
                        <Link href="/pricing" className="flex-1">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                Voir les tarifs
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        );
    }

    return null;
}




