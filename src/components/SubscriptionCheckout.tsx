'use client';

import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Button, Alert, LoadingSpinner } from '@/components/ui';
import { Crown, CreditCard, Shield, Check, Calendar } from 'lucide-react';
import { subscriptionAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionCheckoutProps {
    priceId: string;
    interval: 'monthly' | 'yearly';
    amount: number;
    onSuccess?: () => void;
}

const SubscriptionCheckoutForm = ({ priceId, interval, amount, onSuccess }: SubscriptionCheckoutProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    // Protection robuste avec useRef
    const hasInitialized = useRef(false);
    const isCreatingRef = useRef(false);

    useEffect(() => {
        // Protection contre les appels multiples
        if (hasInitialized.current || isCreatingRef.current || clientSecret) {
            console.log('⚠️ Appel ignoré - déjà initialisé ou en cours');
            return;
        }

        const createSubscription = async () => {
            try {
                hasInitialized.current = true;
                isCreatingRef.current = true;
                console.log('🔄 Création d\'abonnement pour priceId:', priceId);
                const response = await subscriptionAPI.createSubscription(priceId);
                setClientSecret(response.client_secret);
                console.log('✅ Abonnement créé avec succès');
            } catch (err: unknown) {
                console.error('❌ Erreur création abonnement:', err);
                setError('Erreur lors de l\'initialisation de l\'abonnement');
                // Reset en cas d'erreur pour permettre une nouvelle tentative
                hasInitialized.current = false;
                isCreatingRef.current = false;
            } finally {
                isCreatingRef.current = false;
            }
        };

        createSubscription();
    }, [priceId, clientSecret]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Protection contre les double-clics
        if (isProcessing) {
            console.log('⚠️ Soumission déjà en cours, ignorée');
            return;
        }

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                setError('Erreur: Élément de carte non trouvé.');
                setIsProcessing(false);
                return;
            }

            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        email: user?.email,
                        name: `${user?.first_name} ${user?.last_name}`,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message || 'Erreur lors du paiement');
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                // Le webhook va gérer la confirmation automatiquement
                // On redirige vers le profil avec un message de succès
                router.push('/profile?subscription=success');
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
            setError(errorMessage);
            console.error('Erreur de paiement:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
        disableLink: true,
    };

    const getIntervalText = () => {
        return interval === 'monthly' ? 'mois' : 'an';
    };

    const getSavings = () => {
        if (interval === 'yearly') {
            return Math.round((9.99 * 12 - amount / 100) * 100) / 100;
        }
        return 0;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
                <Alert variant="error">
                    {error}
                </Alert>
            )}

            {user && (
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Facturation pour :</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                        <div className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                        </div>
                        <div className="text-gray-600 break-all">
                            {user.email}
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Informations de carte
                </label>
                <div className="p-3 sm:p-4 border border-gray-300 rounded-lg bg-white">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Vos informations de paiement sont sécurisées par Stripe.</span>
            </div>

            <div className="border-t pt-4 sm:pt-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                        <span className="text-gray-900">Abonnement {interval === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                        <span className="text-gray-900">
                            €{(amount / 100).toFixed(2)} / {getIntervalText()}
                        </span>
                    </div>
                    {interval === 'yearly' && (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                            <Check className="w-4 h-4" />
                            <span>Économisez €{getSavings()} par an</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Renouvellement automatique</span>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={!stripe || !elements || isProcessing}
                className="w-full"
            >
                {isProcessing ? (
                    <LoadingSpinner className="text-white" />
                ) : (
                    <>
                        <Crown className="w-4 h-4 mr-2" />
                        S&apos;abonner - €{(amount / 100).toFixed(2)} / {getIntervalText()}
                    </>
                )}
            </Button>
        </form>
    );
};

const SubscriptionCheckout = ({ priceId, interval, amount, onSuccess }: SubscriptionCheckoutProps) => {
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionCheckoutForm
                priceId={priceId}
                interval={interval}
                amount={amount}
                onSuccess={onSuccess}
            />
        </Elements>
    );
};

export default SubscriptionCheckout;
