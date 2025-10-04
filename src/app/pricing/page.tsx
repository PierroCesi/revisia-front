'use client';

import { useState } from 'react';
import { Button, Card, Typography, Badge, Toggle } from '@/components/ui';
import { Check, Crown, Star, Users, Brain, Mail, Shield, Users2 } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = [
        {
            name: 'Gratuit',
            price: { monthly: 0, annual: 0 },
            description: 'Parfait pour tester Revisia',
            features: [
                '1 quiz par jour',
                '6 questions maximum',
                '2 tentatives par quiz',
                'Historique 30 jours',
                'Support communautaire'
            ],
            limitations: [
                'IA basique (modèle limité)',
                'Pas de statistiques avancées'
            ],
            cta: 'Commencer gratuitement',
            ctaLink: '/register',
            popular: false,
            icon: Users,
            color: 'gray'
        },
        {
            name: 'Premium',
            price: { monthly: 9.99, annual: 99.99 },
            originalPrice: { monthly: 15.99, annual: 159.99 },
            description: 'Pour les utilisateurs sérieux',
            features: [
                'Quiz illimités',
                '50 questions max par quiz',
                'Tentatives illimitées',
                'Dernier modèle OpenAI',
                'Historique complet',
                'Statistiques avancées',
                'Support prioritaire',
                'Fonctionnalités exclusives'
            ],
            limitations: [],
            cta: 'Passer à Premium',
            ctaLink: '/checkout',
            popular: true,
            icon: Crown,
            color: 'orange'
        },
        {
            name: 'Pro',
            price: { monthly: 25.99, annual: 259.99 },
            description: 'Fonctionnalités avancées pour professionnels',
            features: [
                'Tout du plan Premium',
                'Mode révision intelligente',
                'Analyses de performance IA',
                'Quiz collaboratifs en temps réel',
                'Bibliothèque de modèles',
                'Intégration calendrier',
                'Rapports de progression détaillés',
                'Support prioritaire 24/7',
                'API avancée',
                'Thèmes personnalisables'
            ],
            limitations: [],
            cta: 'Passer à Pro',
            ctaLink: '/checkout?plan=pro',
            popular: false,
            icon: Shield,
            color: 'blue',
            disabled: false
        },
        {
            name: 'Solution personnalisée',
            price: { monthly: null, annual: null },
            description: 'Sur mesure selon vos besoins',
            features: [
                'Fonctionnalités à définir',
                'selon vos besoins spécifiques',
                'Intégrations personnalisées',
                'Support dédié',
                'Formation sur mesure',
                'Développements sur mesure',
                'SLA personnalisé',
                'Prix adapté à votre usage'
            ],
            limitations: [],
            cta: 'Nous contacter',
            ctaLink: 'mailto:contact@revisia-app.fr?subject=Demande%20solution%20personnalisée',
            popular: false,
            icon: Users2,
            color: 'gray',
            disabled: false
        }
    ];

    const getPrice = (plan: typeof plans[0]) => {
        const price = isAnnual ? plan.price.annual : plan.price.monthly;
        if (price === 0) return 'Gratuit';
        if (price === null) return 'Sur devis';
        return `€${price}/${isAnnual ? 'an' : 'mois'}`;
    };

    const getSavings = () => {
        if (!isAnnual) return null;
        const monthlyTotal = 9.99 * 12;
        const annualPrice = 99.99;
        const savings = monthlyTotal - annualPrice;
        return `Économisez €${savings.toFixed(2)}/an`;
    };

    // const getProSavings = () => {
    //     if (!isAnnual) return null;
    //     const monthlyTotal = 25.99 * 12;
    //     const annualPrice = 259.99;
    //     const savings = monthlyTotal - annualPrice;
    //     return `Économisez €${savings.toFixed(2)}/an`;
    // };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center space-x-2">
                        <Crown className="w-8 h-8 text-orange-600" />
                        <Typography variant="h1" className="text-4xl lg:text-6xl font-bold text-gray-900">
                            Tarifs
                        </Typography>
                    </div>

                    <Typography variant="body" className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choisissez le plan qui correspond à vos besoins d&apos;apprentissage
                    </Typography>

                    {/* Toggle Annual/Monthly */}
                    <div className="flex items-center justify-center space-x-4 mt-8">
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
                            <Badge variant="success" className="ml-2">
                                {getSavings()}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-7xl mx-auto">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <Card
                                key={plan.name}
                                className={`widget-card p-6 relative h-full flex flex-col ${plan.popular
                                    ? 'border-orange-300 bg-orange-50 shadow-2xl scale-105 ring-2 ring-orange-200'
                                    : 'border-gray-200 hover:shadow-lg transition-all duration-300'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <Badge variant="secondary" className="bg-orange-soft text-orange-700 border-0 shadow-sm px-3 py-1">
                                            <Star className="w-3 h-3 mr-1" />
                                            Populaire
                                        </Badge>
                                    </div>
                                )}

                                <div className="text-center space-y-4 flex-1 flex flex-col">
                                    {/* Plan Header */}
                                    <div className="space-y-2">
                                        <div className={`${plan.popular ? 'w-16 h-16' : 'w-12 h-12'} mx-auto rounded-full flex items-center justify-center ${plan.color === 'orange' ? 'bg-orange-500' :
                                            plan.color === 'blue' ? 'bg-blue-500' :
                                                'bg-gray-500'
                                            }`}>
                                            <Icon className={`${plan.popular ? 'w-8 h-8' : 'w-6 h-6'} text-white`} />
                                        </div>
                                        <Typography variant={plan.popular ? "h3" : "h4"} className={`font-bold ${plan.popular ? 'text-orange-700' : 'text-gray-900'}`}>
                                            {plan.name}
                                        </Typography>
                                        <Typography variant="caption" className="text-gray-600">
                                            {plan.description}
                                        </Typography>
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-1">
                                        {plan.originalPrice && (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Typography variant="caption" className="text-gray-500 line-through text-sm">
                                                    €{isAnnual ? plan.originalPrice.annual : plan.originalPrice.monthly}/{isAnnual ? 'an' : 'mois'}
                                                </Typography>
                                                <span className="inline-flex items-center font-bold rounded-full bg-red-500 text-white text-xs px-2 py-1 shadow-sm">
                                                    -{Math.round(((isAnnual ? plan.originalPrice.annual : plan.originalPrice.monthly) - (isAnnual ? plan.price.annual : plan.price.monthly)) / (isAnnual ? plan.originalPrice.annual : plan.originalPrice.monthly) * 100)}%
                                                </span>
                                            </div>
                                        )}
                                        <Typography variant={plan.popular ? "h2" : "h3"} className={`${plan.popular ? 'text-3xl' : 'text-2xl'} font-bold ${plan.popular ? 'text-orange-700' : 'text-gray-900'}`}>
                                            {getPrice(plan)}
                                        </Typography>
                                        {isAnnual && plan.price.annual && plan.price.annual > 0 && (
                                            <Typography variant="caption" className="text-gray-500">
                                                Soit €{(plan.price.annual / 12).toFixed(2)}/mois
                                            </Typography>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2 text-left flex-1">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start space-x-2">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                <Typography variant="caption" className="text-gray-700 text-xs">
                                                    {feature}
                                                </Typography>
                                            </div>
                                        ))}
                                        {plan.limitations.map((limitation, limitationIndex) => (
                                            <div key={limitationIndex} className="flex items-start space-x-2 opacity-60">
                                                <div className="w-4 h-4 flex-shrink-0" />
                                                <Typography variant="caption" className="text-gray-500 line-through text-xs">
                                                    {limitation}
                                                </Typography>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="pt-4 mt-auto">
                                        {plan.ctaLink.startsWith('mailto:') ? (
                                            <a href={plan.ctaLink} className="block">
                                                <Button
                                                    className={`w-full ${plan.popular
                                                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                                                        }`}
                                                >
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    {plan.cta}
                                                </Button>
                                            </a>
                                        ) : (
                                            <Link href={plan.ctaLink} className="block">
                                                <Button
                                                    className={`w-full ${plan.popular
                                                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                                        : plan.name === 'Pro'
                                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                                                        }`}
                                                >
                                                    {plan.cta}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <Typography variant="h2" className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Questions fréquentes
                    </Typography>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="widget-card p-6">
                            <Typography variant="h4" className="font-semibold text-gray-900 mb-3">
                                Puis-je changer de plan à tout moment ?
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Oui, vous pouvez passer du plan gratuit au Premium à tout moment.
                                Le changement est immédiat et vous bénéficiez des nouvelles fonctionnalités.
                            </Typography>
                        </Card>

                        <Card className="widget-card p-6">
                            <Typography variant="h4" className="font-semibold text-gray-900 mb-3">
                                Y a-t-il un essai gratuit pour Premium ?
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Le plan gratuit vous permet de tester toutes les fonctionnalités de base.
                                Premium ajoute des fonctionnalités avancées pour les utilisateurs sérieux.
                            </Typography>
                        </Card>

                        <Card className="widget-card p-6">
                            <Typography variant="h4" className="font-semibold text-gray-900 mb-3">
                                Que se passe-t-il si j&apos;annule ?
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Vous conservez l&apos;accès Premium jusqu&apos;à la fin de votre période de facturation,
                                puis revenez au plan gratuit avec vos données sauvegardées.
                            </Typography>
                        </Card>

                        <Card className="widget-card p-6">
                            <Typography variant="h4" className="font-semibold text-gray-900 mb-3">
                                Comment fonctionne l&apos;IA ?
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Nous utilisons le dernier modèle OpenAI pour générer des questions
                                intelligentes à partir de vos documents. L&apos;IA analyse le contenu et crée
                                des quiz adaptés à votre niveau.
                            </Typography>
                        </Card>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24 text-center">
                    <Card className="widget-card p-12 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                        <div className="space-y-6">
                            <div className="flex items-center justify-center space-x-3">
                                <Brain className="w-8 h-8" />
                                <Typography variant="h2" className="text-3xl font-bold">
                                    Prêt à booster votre apprentissage ?
                                </Typography>
                            </div>

                            <Typography variant="body" className="text-xl opacity-90 max-w-2xl mx-auto">
                                Rejoignez des milliers d&apos;étudiants qui utilisent Revisia pour réussir leurs examens
                            </Typography>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                <Link href="/register">
                                    <Button variant="outline" className="bg-white text-orange-600 hover:bg-gray-100">
                                        Commencer gratuitement
                                    </Button>
                                </Link>
                                <Link href="/checkout">
                                    <Button className="bg-white text-orange-600 hover:bg-gray-100">
                                        Passer à Premium
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
