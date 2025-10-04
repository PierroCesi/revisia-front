'use client';

import { useState } from 'react';
import { Card, Typography, Toggle } from '@/components/ui';
import { Crown, Check } from 'lucide-react';
import SubscriptionCheckout from '@/components/SubscriptionCheckout';

export default function CheckoutPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    const price = isAnnual ? 99.99 : 9.99; // Prix avec remise
    const savings = isAnnual ? 19.89 : 0; // Économies
    const amount = Math.round(price * 100); // Montant en centimes pour Stripe

    // Price IDs Stripe
    const monthlyPriceId = 'price_1SEWOrDrRzoIRADbmlBpSSRg';
    const yearlyPriceId = 'price_1SEWPXDrRzoIRADbbsqZ3XkH';

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-6 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                        <Typography variant="h1" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                            Passer à Premium
                        </Typography>
                    </div>
                    <Typography variant="body" className="text-lg sm:text-xl text-gray-600">
                        Débloquez toutes les fonctionnalités de Revisia
                    </Typography>
                </div>

                {/* Billing Toggle */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                        Mensuel
                    </span>
                    <Toggle
                        checked={isAnnual}
                        onChange={setIsAnnual}
                        className="mx-2"
                    />
                    <div className="flex items-center space-x-2">
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

                {/* Plan Details */}
                <Card className="widget-card max-w-2xl mx-auto mb-8 sm:mb-12">
                    <div className="p-4 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-orange-50 rounded-lg border border-orange-200 mb-6 sm:mb-8">
                            <div className="mb-3 sm:mb-0">
                                <Typography variant="h3" className="font-semibold text-orange-800 text-lg sm:text-xl">
                                    Premium {isAnnual ? 'Annuel' : 'Mensuel'}
                                </Typography>
                                <Typography variant="body" className="text-orange-600 text-sm sm:text-base">
                                    Accès illimité à toutes les fonctionnalités
                                </Typography>
                            </div>
                            <div className="text-left sm:text-right">
                                <Typography variant="h2" className="font-bold text-orange-800 text-2xl sm:text-3xl">
                                    €{price}
                                </Typography>
                                <Typography variant="body" className="text-orange-600 text-sm sm:text-base">
                                    {isAnnual ? '/an' : '/mois'}
                                </Typography>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {[
                                'Quiz illimités',
                                '50 questions max par quiz',
                                'Tentatives illimitées',
                                'Dernier modèle OpenAI',
                                'Statistiques avancées',
                                'Support prioritaire'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                    <Typography variant="body" className="text-gray-700 text-sm sm:text-base">
                                        {feature}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Payment Form */}
                <Card className="widget-card max-w-2xl mx-auto">
                    <div className="p-4 sm:p-8">
                        <Typography variant="h3" className="font-bold text-gray-900 mb-6 sm:mb-8 text-center text-lg sm:text-xl">
                            Informations de paiement
                        </Typography>

                        <SubscriptionCheckout
                            priceId={isAnnual ? yearlyPriceId : monthlyPriceId}
                            interval={isAnnual ? 'yearly' : 'monthly'}
                            amount={amount}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
