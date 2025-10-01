'use client';

import { useState, useEffect, useCallback } from 'react';
import { authAPI, UserRoleInfo } from '@/lib/api';

export const useUserRole = () => {
    const [roleInfo, setRoleInfo] = useState<UserRoleInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRoleInfo = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const info = await authAPI.getRoleInfo();
            setRoleInfo(info);
        } catch (err) {
            console.error('Erreur lors de la récupération des informations de rôle:', err);
            setError('Impossible de récupérer les informations de rôle');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoleInfo();
    }, [fetchRoleInfo]);

    const refreshRoleInfo = useCallback(() => {
        fetchRoleInfo();
    }, [fetchRoleInfo]);

    return {
        roleInfo,
        loading,
        error,
        refreshRoleInfo,
        // Helpers pour faciliter l'utilisation
        isGuest: roleInfo?.role === 'guest',
        isFree: roleInfo?.role === 'free',
        isPremium: roleInfo?.role === 'premium',
        canCreateQuiz: roleInfo?.can_create_quiz ?? false,
        canAttemptQuiz: roleInfo?.can_attempt_quiz ?? false,
        maxQuestions: roleInfo?.limits.max_questions ?? 5,
        canSaveResults: roleInfo?.limits.can_save_results ?? false,
        attemptsCountToday: roleInfo?.attempts_count_today ?? 0,
        maxAttemptsPerDay: roleInfo?.limits.max_attempts_per_day ?? 1,
        // Helpers pour les valeurs illimitées
        isUnlimitedQuestions: roleInfo?.limits.max_questions === null,
        isUnlimitedQuizzes: roleInfo?.limits.max_quizzes_per_day === null,
        isUnlimitedAttempts: roleInfo?.limits.max_attempts_per_day === null,
    };
};


