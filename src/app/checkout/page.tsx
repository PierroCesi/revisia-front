'use client';

import { useState } from 'react';
import { Button, Card, Typography, Input, Alert, Toggle } from '@/components/ui';
import { Crown, CreditCard, Shield, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isAnnual, setIsAnnual] = useState(false);
    const [, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        setIsProcessing(true);
        setError('');

        try {
            // Simuler le paiement
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Rediriger vers le dashboard avec un message de succès
            router.push('/dashboard?upgraded=true');
        } catch {
            setError('Erreur lors du paiement. Veuillez réessayer.');
        } finally {
            setIsProcessing(false);
        }
    };

    const originalPrice = isAnnual ? 119.88 : 9.99; // Prix original annuel (9.99 * 12)
    const price = isAnnual ? 99.99 : 9.99; // Prix avec remise
    const savings = isAnnual ? 19.89 : 0; // Économies
    const total = price; // Total final

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Crown className="w-8 h-8 text-orange-600" />
                        <Typography variant="h1" className="text-4xl font-bold text-gray-900">
                            Passer à Premium
                        </Typography>
                    </div>
                    <Typography variant="body" className="text-xl text-gray-600">
                        Débloquez toutes les fonctionnalités de Revisia
                    </Typography>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                        Mensuel
                    </span>
                    <Toggle
                        checked={isAnnual}
                        onChange={setIsAnnual}
                    />
                    <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                        Annuel
                    </span>
                    {isAnnual && (
                        <span className="text-sm text-green-600 font-medium">
                            Économisez €{savings}
                        </span>
                    )}
                </div>

                {/* Plan Details */}
                <Card className="widget-card max-w-2xl mx-auto mb-12">
                    <div className="p-8">
                        <div className="flex justify-between items-center p-6 bg-orange-50 rounded-lg border border-orange-200 mb-8">
                            <div>
                                <Typography variant="h3" className="font-semibold text-orange-800">
                                    Premium {isAnnual ? 'Annuel' : 'Mensuel'}
                                </Typography>
                                <Typography variant="body" className="text-orange-600">
                                    Accès illimité à toutes les fonctionnalités
                                </Typography>
                            </div>
                            <div className="text-right">
                                <Typography variant="h2" className="font-bold text-orange-800">
                                    €{price}
                                </Typography>
                                <Typography variant="body" className="text-orange-600">
                                    {isAnnual ? '/an' : '/mois'}
                                </Typography>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                'Quiz illimités',
                                '50 questions max par quiz',
                                'Tentatives illimitées',
                                'Export PDF',
                                'Partage de quiz',
                                'Statistiques avancées',
                                'Support prioritaire'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <Typography variant="body" className="text-gray-700">
                                        {feature}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Payment Form */}
                <Card className="widget-card max-w-2xl mx-auto">
                    <div className="p-8">
                        <Typography variant="h3" className="font-bold text-gray-900 mb-8 text-center">
                            Informations de paiement
                        </Typography>

                        {error && (
                            <Alert variant="error" className="mb-6">
                                {error}
                            </Alert>
                        )}

                        <div className="space-y-6">
                            {/* User Info */}
                            {user && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Typography variant="body" className="text-gray-600 mb-2">
                                        Facturation pour :
                                    </Typography>
                                    <Typography variant="body" className="font-medium">
                                        {user.first_name} {user.last_name}
                                    </Typography>
                                    <Typography variant="body" className="text-gray-600">
                                        {user.email}
                                    </Typography>
                                </div>
                            )}

                            {/* Payment Method */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="w-5 h-5 text-gray-500" />
                                    <Typography variant="h4" className="font-semibold text-gray-900">
                                        Carte de crédit
                                    </Typography>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Numéro de carte"
                                        placeholder="1234 5678 9012 3456"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="MM/AA"
                                            placeholder="12/25"
                                        />
                                        <Input
                                            label="CVC"
                                            placeholder="123"
                                        />
                                    </div>
                                    <Input
                                        label="Nom sur la carte"
                                        placeholder="Jean Dupont"
                                    />
                                </div>
                            </div>

                            {/* Security */}
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                                <span>Paiement sécurisé par Stripe</span>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <Typography variant="body" className="text-gray-600">
                                        Premium {isAnnual ? 'Annuel' : 'Mensuel'}
                                    </Typography>
                                    <div className="text-right">
                                        {isAnnual && (
                                            <Typography variant="caption" className="text-gray-500 line-through block">
                                                €{originalPrice}
                                            </Typography>
                                        )}
                                        <Typography variant="body" className="font-medium">
                                            €{price}
                                        </Typography>
                                    </div>
                                </div>
                                {isAnnual && (
                                    <div className="flex justify-between items-center mb-2">
                                        <Typography variant="body" className="text-green-600">
                                            Remise annuelle
                                        </Typography>
                                        <Typography variant="body" className="text-green-600 font-medium">
                                            -€{savings}
                                        </Typography>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <Typography variant="h4" className="text-gray-900">
                                        Total
                                    </Typography>
                                    <Typography variant="h4" className="text-gray-900">
                                        €{total}
                                    </Typography>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <Button
                                onClick={handlePayment}
                                disabled={true}
                                className="w-full bg-gray-400 text-white py-3 cursor-not-allowed"
                            >
                                <div className="flex items-center space-x-2">
                                    <Crown className="w-5 h-5" />
                                    <span>Fonctionnalité bientôt disponible</span>
                                </div>
                            </Button>

                            <Typography variant="caption" className="text-gray-500 text-center block">
                                La fonctionnalité de paiement sera bientôt disponible.
                            </Typography>

                            {/* Billing Toggle */}
                            <div className="flex items-center justify-center space-x-4 mt-8 pt-6 border-t">
                                <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                                    Mensuel
                                </span>
                                <Toggle
                                    checked={isAnnual}
                                    onChange={setIsAnnual}
                                />
                                <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                                    Annuel
                                </span>
                                {isAnnual && (
                                    <span className="text-sm text-green-600 font-medium">
                                        Économisez €{savings}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
