'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Button, Alert } from '@/components/ui';
import { Crown, Calendar, CreditCard, X, CheckCircle } from 'lucide-react';
import { subscriptionAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

interface SubscriptionInfo {
    is_premium: boolean;
    subscription_status: 'active' | 'expired' | 'permanent' | 'inactive';
    is_subscription_active: boolean;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    current_period_end: string | null;
    days_remaining: number | null;
    subscription_interval: string | null;
    cancel_at_period_end: boolean;
    canceled_at: string | null;
    user_role: string;
}

export default function SubscriptionInfo() {
    const { user, updateUser } = useAuth();
    const searchParams = useSearchParams();
    const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [cancelSuccess, setCancelSuccess] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const loadSubscriptionInfo = useCallback(async () => {
        try {
            const info = await subscriptionAPI.getSubscriptionInfo();
            // Assurer que l'objet correspond à l'interface SubscriptionInfo
            const extendedInfo = info as SubscriptionInfo & { stripe_customer_id?: string; stripe_subscription_id?: string };
            const subscriptionData: SubscriptionInfo = {
                is_premium: info.is_premium,
                subscription_status: info.subscription_status,
                is_subscription_active: info.is_subscription_active,
                stripe_customer_id: extendedInfo.stripe_customer_id || null,
                stripe_subscription_id: extendedInfo.stripe_subscription_id || null,
                current_period_end: info.current_period_end,
                days_remaining: info.days_remaining,
                subscription_interval: info.subscription_interval,
                cancel_at_period_end: info.cancel_at_period_end,
                canceled_at: info.canceled_at,
                user_role: info.user_role
            };
            setSubscriptionInfo(subscriptionData);

            // Mettre à jour l'utilisateur dans le contexte si les infos ont changé
            if (user && info.is_premium !== user.is_premium) {
                updateUser({
                    ...user,
                    is_premium: info.is_premium
                });
            }
        } catch (err: unknown) {
            setError('Erreur lors du chargement des informations d\'abonnement');
            console.error('Erreur subscription info:', err);
        } finally {
            setLoading(false);
        }
    }, [user, updateUser]);

    useEffect(() => {
        loadSubscriptionInfo();

        // Vérifier si on vient d'un paiement réussi
        if (searchParams.get('subscription') === 'success') {
            setShowSuccessMessage(true);
            // Rafraîchir les données après un délai pour laisser le temps au webhook
            setTimeout(() => {
                loadSubscriptionInfo();
            }, 2000);
        }
    }, [searchParams, loadSubscriptionInfo]);

    const handleCancelSubscription = async () => {
        if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Il sera actif jusqu\'à la fin de la période courante.')) {
            return;
        }

        setCancelling(true);
        try {
            const result = await subscriptionAPI.cancelSubscription();
            if (result.success) {
                setCancelSuccess(true);
                await loadSubscriptionInfo(); // Recharger les infos
            }
        } catch (err: unknown) {
            setError('Erreur lors de l\'annulation de l\'abonnement');
            console.error('Erreur annulation:', err);
        } finally {
            setCancelling(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-600 bg-green-50';
            case 'trialing':
                return 'text-blue-600 bg-blue-50';
            case 'past_due':
                return 'text-yellow-600 bg-yellow-50';
            case 'canceled':
            case 'incomplete_expired':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Actif';
            case 'trialing':
                return 'Essai';
            case 'past_due':
                return 'En retard';
            case 'canceled':
                return 'Annulé';
            case 'incomplete_expired':
                return 'Expiré';
            default:
                return status;
        }
    };

    const isSubscriptionCanceled = () => {
        // Utiliser le champ cancel_at_period_end pour une détection précise
        return subscriptionInfo?.cancel_at_period_end === true ||
            subscriptionInfo?.subscription_status === 'inactive';
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Card className="widget-card p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
            </Card>
        );
    }

    if (!subscriptionInfo) {
        return (
            <Card className="widget-card p-6">
                <Alert variant="error">
                    Impossible de charger les informations d&apos;abonnement
                </Alert>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Message de succès après paiement */}
            {showSuccessMessage && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <div className="flex items-center justify-between">
                        <span>🎉 Abonnement Premium activé avec succès !</span>
                        <button
                            onClick={() => setShowSuccessMessage(false)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </Alert>
            )}
            <Card className="widget-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-soft rounded-xl flex items-center justify-center">
                            <Crown className="w-5 h-5 text-orange-700" />
                        </div>
                        <div>
                            <Typography variant="h4" className="font-bold text-gray-900">
                                Abonnement Premium
                            </Typography>
                            <Typography variant="body" color="muted">
                                Gestion de votre abonnement
                            </Typography>
                        </div>
                    </div>
                </div>

                {error && (
                    <Alert variant="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {cancelSuccess && (
                    <Alert variant="success" className="mb-4">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <Typography variant="body" className="font-semibold text-green-800">
                                    Abonnement annulé
                                </Typography>
                                <Typography variant="body" className="text-green-700">
                                    Votre abonnement sera actif jusqu&apos;à la fin de la période courante.
                                </Typography>
                            </div>
                        </div>
                    </Alert>
                )}

                <div className="space-y-4">
                    {/* Statut de l'abonnement */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div>
                                <Typography variant="body" className="font-medium text-gray-900">
                                    Statut
                                </Typography>
                                <Typography variant="body" color="muted">
                                    {isSubscriptionCanceled() ?
                                        'Abonnement annulé (actif jusqu\'à expiration)' :
                                        subscriptionInfo.is_subscription_active ? 'Abonnement actif' : 'Aucun abonnement'
                                    }
                                </Typography>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionInfo.subscription_status)}`}>
                            {getStatusLabel(subscriptionInfo.subscription_status)}
                        </span>
                    </div>

                    {/* Informations de facturation - seulement si abonnement actif */}
                    {subscriptionInfo.stripe_subscription_id && !isSubscriptionCanceled() && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3">
                                <CreditCard className="w-5 h-5 text-gray-500" />
                                <Typography variant="body" className="font-medium text-gray-900">
                                    Informations de facturation
                                </Typography>
                            </div>
                            <div className="space-y-2 text-sm">
                                {subscriptionInfo.current_period_end && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Prochaine facturation:</span>
                                        <span className="text-gray-900">{formatDate(subscriptionInfo.current_period_end)}</span>
                                    </div>
                                )}
                                {subscriptionInfo.subscription_interval && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Fréquence:</span>
                                        <span className="text-gray-900">
                                            {subscriptionInfo.subscription_interval === 'month' ? 'Mensuel' : 'Annuel'}
                                        </span>
                                    </div>
                                )}
                                {subscriptionInfo.days_remaining !== null && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Jours restants:</span>
                                        <span className="text-gray-900">{subscriptionInfo.days_remaining} jours</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Informations d'annulation - seulement si annulé mais encore actif */}
                    {isSubscriptionCanceled() && subscriptionInfo.is_premium && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center space-x-3 mb-3">
                                <X className="w-5 h-5 text-orange-600" />
                                <Typography variant="body" className="font-medium text-orange-900">
                                    Abonnement annulé
                                </Typography>
                            </div>
                            <Typography variant="body" className="text-orange-700 mb-3">
                                Vous conservez votre accès Premium jusqu&apos;à la fin de votre période payée.
                                Aucune nouvelle facturation ne sera effectuée.
                            </Typography>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-orange-600">Accès Premium jusqu&apos;au:</span>
                                    <span className="text-orange-900 font-medium">
                                        {subscriptionInfo.current_period_end ? formatDate(subscriptionInfo.current_period_end) : 'N/A'}
                                    </span>
                                </div>
                                {subscriptionInfo.days_remaining !== null && (
                                    <div className="flex justify-between">
                                        <span className="text-orange-600">Jours restants:</span>
                                        <span className="text-orange-900 font-medium">{subscriptionInfo.days_remaining} jours</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        {/* Bouton d'annulation - seulement si actif et pas encore annulé */}
                        {subscriptionInfo.is_subscription_active && subscriptionInfo.stripe_subscription_id && !isSubscriptionCanceled() && (
                            <Button
                                variant="outline"
                                onClick={handleCancelSubscription}
                                disabled={cancelling}
                                className="flex items-center space-x-2"
                            >
                                <X className="w-4 h-4" />
                                <span>{cancelling ? 'Annulation...' : 'Annuler l\'abonnement'}</span>
                            </Button>
                        )}

                        {/* Bouton de réactivation - si annulé mais encore actif */}
                        {isSubscriptionCanceled() && subscriptionInfo.is_premium && (
                            <Button
                                variant="primary"
                                onClick={() => window.location.href = '/checkout'}
                                className="flex items-center space-x-2"
                            >
                                <Crown className="w-4 h-4" />
                                <span>Réactiver l&apos;abonnement</span>
                            </Button>
                        )}

                        {/* Bouton d'abonnement - si pas d'abonnement du tout */}
                        {!subscriptionInfo.is_subscription_active && !isSubscriptionCanceled() && (
                            <Button
                                variant="primary"
                                onClick={() => window.location.href = '/checkout'}
                                className="flex items-center space-x-2"
                            >
                                <Crown className="w-4 h-4" />
                                <span>Passer à Premium</span>
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}