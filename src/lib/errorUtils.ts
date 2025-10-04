/**
 * Utilitaires pour gérer les erreurs de l'API
 */

export interface ApiError {
    response?: {
        data?: {
            non_field_errors?: string[];
            email?: string | string[];
            password?: string | string[];
            username?: string | string[];
            detail?: string;
            [key: string]: unknown;
        };
    };
}

/**
 * Extrait le message d'erreur principal d'une réponse d'erreur API
 * @param error - L'erreur à analyser
 * @param defaultMessage - Message par défaut si aucune erreur spécifique n'est trouvée
 * @returns Le message d'erreur à afficher
 */
export function extractErrorMessage(error: unknown, defaultMessage: string = 'Une erreur est survenue'): string {
    const errorResponse = error as ApiError;

    if (!errorResponse?.response?.data) {
        return defaultMessage;
    }

    const data = errorResponse.response.data;

    // Gérer les erreurs non_field_errors (erreurs générales)
    if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        return data.non_field_errors[0];
    }

    // Gérer les erreurs de champs spécifiques
    const fieldErrors = ['email', 'password', 'username', 'first_name', 'last_name'];
    for (const field of fieldErrors) {
        if (data[field]) {
            return Array.isArray(data[field]) ? data[field][0] : String(data[field]);
        }
    }

    // Gérer les erreurs detail (format standard)
    if (data.detail) {
        return data.detail;
    }

    return defaultMessage;
}

/**
 * Messages d'erreur par défaut pour les différentes actions
 */
export const DEFAULT_ERROR_MESSAGES = {
    LOGIN: 'Erreur de connexion',
    REGISTER: 'Erreur lors de l\'inscription',
    PROFILE_UPDATE: 'Erreur lors de la mise à jour du profil',
    GENERIC: 'Une erreur est survenue'
} as const;

