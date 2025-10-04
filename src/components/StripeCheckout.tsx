'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Button, Alert, LoadingSpinner } from '@/components/ui';
import { Crown, CreditCard, Shield } from 'lucide-react';
import { stripeAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Configuration Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
    amount: number;
    isAnnual: boolean;
    onSuccess?: () => void;
}

const CheckoutForm = ({ amount, isAnnual, onSuccess }: StripeCheckoutProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user, updateUser } = useAuth();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    // Créer le PaymentIntent au chargement
    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                const response = await stripeAPI.createPaymentIntent(amount);
                setClientSecret(response.client_secret);
            } catch (err: unknown) {
                setError('Erreur lors de l\'initialisation du paiement');
                console.error('Erreur PaymentIntent:', err);
            }
        };

        createPaymentIntent();
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                throw new Error('Élément de carte non trouvé');
            }

            // Confirmer le paiement
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${user?.first_name} ${user?.last_name}`,
                        email: user?.email,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message || 'Erreur lors du paiement');
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                // Confirmer le paiement côté backend
                const confirmResponse = await stripeAPI.confirmPayment(paymentIntent.id);

                if (confirmResponse.success) {
                    // Mettre à jour l'utilisateur dans le contexte
                    updateUser(confirmResponse.user);

                    // Rediriger vers le dashboard avec un message de succès
                    router.push('/dashboard?upgraded=true');

                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    setError('Erreur lors de la confirmation du paiement');
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
        disableLink: true, // Désactive le bouton "Autofill link"
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
                <Alert variant="error">
                    {error}
                </Alert>
            )}

            {/* Informations utilisateur */}
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

            {/* Élément de carte Stripe */}
            <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Informations de carte
                </label>
                <div className="p-3 sm:p-4 border border-gray-300 rounded-lg bg-white">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>

            {/* Sécurité */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Paiement sécurisé par Stripe</span>
            </div>

            {/* Résumé du prix */}
            <div className="border-t pt-4 sm:pt-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">
                        Premium {isAnnual ? 'Annuel' : 'Mensuel'}
                    </span>
                    <div className="text-right">
                        <span className="text-sm sm:text-base font-medium">€{(amount / 100).toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">€{(amount / 100).toFixed(2)}</span>
                </div>
            </div>

            {/* Bouton de paiement */}
            <Button
                type="submit"
                disabled={!stripe || !clientSecret || isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 sm:py-3 text-sm sm:text-base"
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Traitement en cours...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2">
                        <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Payer €{(amount / 100).toFixed(2)}</span>
                    </div>
                )}
            </Button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
                En cliquant sur &quot;Payer&quot;, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
            </p>
        </form>
    );
};

const StripeCheckout = ({ amount, isAnnual, onSuccess }: StripeCheckoutProps) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                amount={amount}
                isAnnual={isAnnual}
                onSuccess={onSuccess}
            />
        </Elements>
    );
};

export default StripeCheckout;
