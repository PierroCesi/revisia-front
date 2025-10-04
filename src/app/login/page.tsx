'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { extractErrorMessage, DEFAULT_ERROR_MESSAGES } from '@/lib/errorUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card, Input, Typography, Alert } from '@/components/ui';

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError('');

        try {
            await login(data.email, data.password);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(extractErrorMessage(err, DEFAULT_ERROR_MESSAGES.LOGIN));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen dashboard-gradient flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="text-center">
                        <Link href="/">
                            <Typography variant="h3" className="font-bold text-foreground">
                                Révisia
                            </Typography>
                        </Link>
                    </div>
                    <Typography variant="h2" className="mt-6 text-center">
                        Connectez-vous à votre compte
                    </Typography>
                    <Typography variant="body" color="muted" className="mt-2 text-center">
                        Ou{' '}
                        <Link
                            href="/register"
                            className="font-medium text-orange-700 hover:text-orange-600"
                        >
                            créez un nouveau compte
                        </Link>
                    </Typography>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Card padding="lg">
                        {error && (
                            <Alert variant="error" className="mb-6">
                                {error}
                            </Alert>
                        )}

                        <div className="space-y-6">
                            <Input
                                {...register('email')}
                                type="email"
                                label="Adresse email"
                                placeholder="votre@email.com"
                                error={errors.email?.message}
                                autoComplete="email"
                            />

                            <Input
                                {...register('password')}
                                type="password"
                                label="Mot de passe"
                                placeholder="Votre mot de passe"
                                error={errors.password?.message}
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="mt-8">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="primary"
                                size="lg"
                                className="w-full"
                            >
                                {isLoading ? 'Connexion...' : 'Se connecter'}
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
}
