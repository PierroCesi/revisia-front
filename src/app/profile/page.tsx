'use client';

import { useEffect } from 'react';
import { Card, Typography, Button, Alert } from '@/components/ui';
import { User, Settings, Crown, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionInfo from '@/components/SubscriptionInfo';

export default function ProfilePage() {
    const { user } = useAuth();

    useEffect(() => {
        // Vérifier si l'utilisateur vient de s'abonner
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('subscription') === 'success') {
            // Nettoyer l'URL
            const url = new URL(window.location.href);
            url.searchParams.delete('subscription');
            window.history.replaceState({}, '', url.toString());
        }
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen dashboard-gradient flex items-center justify-center">
                <Alert variant="error">
                    Vous devez être connecté pour accéder à cette page.
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen dashboard-gradient py-8">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <User className="w-8 h-8 text-orange-600" />
                        <Typography variant="h1" className="text-4xl font-bold text-gray-900">
                            Mon Profil
                        </Typography>
                    </div>
                    <Typography variant="body" className="text-xl text-gray-600">
                        Gérez vos informations et votre abonnement
                    </Typography>
                </div>


                <div className="grid md:grid-cols-2 gap-8">
                    {/* Informations personnelles */}
                    <Card className="widget-card p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-blue-soft rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                                <Typography variant="h4" className="font-bold text-gray-900">
                                    Informations personnelles
                                </Typography>
                                <Typography variant="body" color="muted">
                                    Vos données de compte
                                </Typography>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Typography variant="body" className="font-medium text-gray-900 mb-2">
                                    Nom complet
                                </Typography>
                                <Typography variant="body" className="text-gray-600">
                                    {user.first_name} {user.last_name}
                                </Typography>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Typography variant="body" className="font-medium text-gray-900 mb-2">
                                    Email
                                </Typography>
                                <Typography variant="body" className="text-gray-600">
                                    {user.email}
                                </Typography>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Typography variant="body" className="font-medium text-gray-900 mb-2">
                                    Nom d&apos;utilisateur
                                </Typography>
                                <Typography variant="body" className="text-gray-600">
                                    {user.username}
                                </Typography>
                            </div>

                            {user.education_level && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Typography variant="body" className="font-medium text-gray-900 mb-2">
                                        Niveau d&apos;éducation
                                    </Typography>
                                    <Typography variant="body" className="text-gray-600">
                                        {user.education_level}
                                    </Typography>
                                </div>
                            )}

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Typography variant="body" className="font-medium text-gray-900 mb-2">
                                    Membre depuis
                                </Typography>
                                <Typography variant="body" className="text-gray-600">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'N/A'}
                                </Typography>
                            </div>
                        </div>
                    </Card>

                    {/* Informations d'abonnement */}
                    <SubscriptionInfo />
                </div>

                {/* Actions rapides */}
                <Card className="widget-card p-6 mt-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-purple-soft rounded-xl flex items-center justify-center">
                            <Settings className="w-5 h-5 text-purple-700" />
                        </div>
                        <div>
                            <Typography variant="h4" className="font-bold text-gray-900">
                                Actions rapides
                            </Typography>
                            <Typography variant="body" color="muted">
                                Gérer votre compte
                            </Typography>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/dashboard'}
                            className="flex items-center space-x-2"
                        >
                            <Calendar className="w-4 h-4" />
                            <span>Mes leçons</span>
                        </Button>

                        {!user.is_premium && (
                            <Button
                                variant="primary"
                                onClick={() => window.location.href = '/checkout'}
                                className="flex items-center space-x-2"
                            >
                                <Crown className="w-4 h-4" />
                                <span>Passer à Premium</span>
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => {
                                // Logout logic
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('refresh_token');
                                window.location.href = '/login';
                            }}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                        >
                            <User className="w-4 h-4" />
                            <span>Se déconnecter</span>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}