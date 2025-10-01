'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, Button, Input, Typography, Badge, LoadingSpinner, ErrorAlert } from '@/components/ui';
import { User, Calendar, Crown, Settings, ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const { roleInfo, loading: roleLoading, isPremium } = useUserRole();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        education_level: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                email: user.email || '',
                education_level: user.education_level || ''
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Appel de l'API pour mettre à jour le profil
            await authAPI.updateProfile(formData);

            setSuccess('Profil mis à jour avec succès !');
            setIsEditing(false);
            refreshUser();
        } catch (err: unknown) {
            console.error('Erreur lors de la mise à jour du profil:', err);

            let errorMessage = 'Erreur lors de la mise à jour du profil';

            const errorWithResponse = err as { response?: { data?: { error?: string; detail?: string; message?: string } }; message?: string };
            if (errorWithResponse?.response?.data?.error) {
                errorMessage = errorWithResponse.response.data.error;
            } else if (errorWithResponse?.response?.data?.detail) {
                errorMessage = errorWithResponse.response.data.detail;
            } else if (errorWithResponse?.response?.data?.message) {
                errorMessage = errorWithResponse.response.data.message;
            } else if (errorWithResponse?.message) {
                errorMessage = errorWithResponse.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                username: user.username || '',
                email: user.email || '',
                education_level: user.education_level || ''
            });
        }
        setIsEditing(false);
        setError(null);
        setSuccess(null);
    };

    const getRoleBadge = () => {
        if (isPremium) {
            return (
                <Badge variant="secondary" className="bg-orange-soft text-orange-700 border-0 shadow-sm">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                </Badge>
            );
        }
        return (
            <Badge variant="secondary">
                Gratuit
            </Badge>
        );
    };

    const getSubscriptionInfo = () => {
        if (isPremium) {
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-3">
                            <Crown className="w-6 h-6 text-orange-600" />
                            <div>
                                <Typography variant="h6" className="font-semibold text-orange-900">
                                    Abonnement Premium Actif
                                </Typography>
                                <Typography variant="body" className="text-orange-700">
                                    Accès illimité à toutes les fonctionnalités
                                </Typography>
                            </div>
                        </div>
                        <Check className="w-6 h-6 text-green-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border">
                            <Typography variant="h4" className="font-bold text-orange-600">∞</Typography>
                            <Typography variant="body" className="text-gray-600">Questions par quiz</Typography>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border">
                            <Typography variant="h4" className="font-bold text-orange-600">∞</Typography>
                            <Typography variant="body" className="text-gray-600">Quiz par jour</Typography>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border">
                            <Typography variant="h4" className="font-bold text-orange-600">∞</Typography>
                            <Typography variant="body" className="text-gray-600">Tentatives par jour</Typography>
                        </div>
                    </div>

                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <Typography variant="body" className="text-orange-700">
                            🎉 Félicitations ! Vous profitez de toutes les fonctionnalités Premium
                        </Typography>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <Typography variant="h6" className="font-semibold text-gray-900">
                                Compte Gratuit
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                Limites appliquées
                            </Typography>
                        </div>
                        <X className="w-6 h-6 text-gray-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                        <Typography variant="h4" className="font-bold text-gray-600">6</Typography>
                        <Typography variant="body" className="text-gray-600">Questions par quiz</Typography>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                        <Typography variant="h4" className="font-bold text-gray-600">1</Typography>
                        <Typography variant="body" className="text-gray-600">Quiz par jour</Typography>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                        <Typography variant="h4" className="font-bold text-gray-600">2</Typography>
                        <Typography variant="body" className="text-gray-600">Tentatives par jour</Typography>
                    </div>
                </div>

                <Link href="/pricing">
                    <Button className="w-full">
                        <Crown className="w-4 h-4 mr-2" />
                        Passer à Premium
                    </Button>
                </Link>
            </div>
        );
    };

    if (!user) {
        return (
            <div className="min-h-screen dashboard-gradient flex items-center justify-center">
                <Card className="widget-card p-8 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-soft rounded-xl flex items-center justify-center mx-auto">
                            <User className="w-8 h-8 text-red-700" />
                        </div>
                        <Typography variant="h4" className="font-bold text-foreground">
                            Non connecté
                        </Typography>
                        <Typography variant="body" color="muted">
                            Vous devez être connecté pour accéder à votre profil
                        </Typography>
                        <Link href="/login">
                            <Button className="bg-orange-primary text-white hover:bg-orange-700">
                                Se connecter
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen dashboard-gradient">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <Typography variant="h3" className="font-bold text-foreground">
                            Mon Profil
                        </Typography>
                        <Typography variant="body" color="muted">
                            Gérez vos informations personnelles et votre abonnement
                        </Typography>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6">
                        <ErrorAlert
                            message={error}
                            onDismiss={() => setError(null)}
                        />
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-600 mr-2" />
                            <Typography variant="body" className="text-green-800">
                                {success}
                            </Typography>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profil Information */}
                    <Card className="widget-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <Typography variant="h5" className="font-semibold text-foreground">
                                Informations personnelles
                            </Typography>
                            {getRoleBadge()}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Prénom"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-100 text-gray-500" : ""}
                                />
                                <Input
                                    label="Nom"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-100 text-gray-500" : ""}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nom d'utilisateur"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-gray-100 text-gray-500" : ""}
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={true}
                                    className="bg-gray-100 text-gray-500"
                                    helperText="L'email ne peut pas être modifié"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Niveau d&apos;éducation
                                </label>
                                <select
                                    name="education_level"
                                    value={formData.education_level}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-input rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 bg-background text-foreground focus:border-orange-500 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-500"
                                >
                                    <option value="">Sélectionnez votre niveau</option>
                                    <optgroup label="🏫 Collège">
                                        <option value="6ème">6ème</option>
                                        <option value="5ème">5ème</option>
                                        <option value="4ème">4ème</option>
                                        <option value="3ème">3ème</option>
                                    </optgroup>
                                    <optgroup label="🎓 Lycée">
                                        <option value="2nde">2nde</option>
                                        <option value="1ère">1ère</option>
                                        <option value="Terminale">Terminale</option>
                                    </optgroup>
                                    <optgroup label="🎓 Supérieur">
                                        <option value="BTS">BTS</option>
                                        <option value="DUT">DUT</option>
                                        <option value="Licence">Licence</option>
                                        <option value="Master">Master</option>
                                        <option value="Doctorat">Doctorat</option>
                                    </optgroup>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            'Sauvegarder'
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        Annuler
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Modifier le profil
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Subscription Information */}
                    <Card className="widget-card p-6">
                        <Typography variant="h5" className="font-semibold text-foreground mb-6">
                            Abonnement
                        </Typography>

                        {roleLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            getSubscriptionInfo()
                        )}
                    </Card>
                </div>

                {/* Usage Statistics */}
                {roleInfo && (
                    <Card className="widget-card p-6 mt-8">
                        <Typography variant="h5" className="font-semibold text-foreground mb-6">
                            Statistiques d&apos;utilisation
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg border">
                                <Typography variant="h4" className="font-bold text-orange-600">
                                    {roleInfo.quiz_count_today}
                                </Typography>
                                <Typography variant="body" className="text-gray-600">
                                    Quiz créés aujourd&apos;hui
                                </Typography>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border">
                                <Typography variant="h4" className="font-bold text-orange-600">
                                    {roleInfo.attempts_count_today}
                                </Typography>
                                <Typography variant="body" className="text-gray-600">
                                    Tentatives aujourd&apos;hui
                                </Typography>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
