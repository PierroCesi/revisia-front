import { useState, useEffect, useCallback } from 'react';

interface GuestSession {
    sessionId: string | null;
    isGuest: boolean;
}

export const useGuestSession = () => {
    const [session, setSession] = useState<GuestSession>({
        sessionId: null,
        isGuest: false
    });

    useEffect(() => {
        // Vérifier si on est en mode invité
        const checkGuestStatus = () => {
            const hasToken = !!localStorage.getItem('access_token');
            const sessionId = localStorage.getItem('guest_session_id');
            // On est invité si on a une session invité, même après inscription
            const isGuest = !!sessionId;

            console.log('🔍 useGuestSession - hasToken:', hasToken, 'sessionId:', sessionId, 'isGuest:', isGuest);

            setSession({
                sessionId,
                isGuest
            });
        };

        checkGuestStatus();

        // Écouter les changements de localStorage
        const handleStorageChange = () => {
            checkGuestStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const createGuestSession = useCallback((sessionId: string) => {
        localStorage.setItem('guest_session_id', sessionId);
        setSession({
            sessionId,
            isGuest: true
        });
    }, []);

    const clearGuestSession = useCallback(() => {
        localStorage.removeItem('guest_session_id');
        setSession({
            sessionId: null,
            isGuest: false
        });
    }, []);

    const transferToUser = useCallback(() => {
        // Quand l'utilisateur se connecte, on garde la session pour le transfert
        // mais on n'est plus considéré comme invité
        setSession(prev => ({
            ...prev,
            isGuest: false
        }));
    }, []);

    return {
        sessionId: session.sessionId,
        isGuest: session.isGuest,
        createGuestSession,
        clearGuestSession,
        transferToUser
    };
};
