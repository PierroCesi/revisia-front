// lib/fileLimits.ts
export interface FileLimit {
    maxSizeBytes: number
    maxSizeMB: number
    maxSizeFormatted: string
}

export const FILE_LIMITS: Record<string, FileLimit> = {
    guest: {
        maxSizeBytes: 2 * 1024 * 1024, // 2 MB
        maxSizeMB: 2,
        maxSizeFormatted: '2 MB'
    },
    free: {
        maxSizeBytes: 5 * 1024 * 1024, // 5 MB
        maxSizeMB: 5,
        maxSizeFormatted: '5 MB'
    },
    premium: {
        maxSizeBytes: 50 * 1024 * 1024, // 50 MB
        maxSizeMB: 50,
        maxSizeFormatted: '50 MB'
    }
}

export const getFileLimit = (userRole: string): FileLimit => {
    return FILE_LIMITS[userRole] || FILE_LIMITS.guest
}

export const validateFileSize = (file: File, userRole: string): { isValid: boolean; error?: string } => {
    const limit = getFileLimit(userRole)

    if (file.size > limit.maxSizeBytes) {
        let errorMessage = ''

        switch (userRole) {
            case 'guest':
                errorMessage = `Fichier trop volumineux (${formatFileSize(file.size)}). Limite invité : 2 MB. Inscrivez-vous pour uploader des fichiers jusqu'à 5 MB.`
                break
            case 'free':
                errorMessage = `Fichier trop volumineux (${formatFileSize(file.size)}). Limite compte gratuit : 5 MB. Passez à Premium pour uploader des fichiers jusqu'à 50 MB.`
                break
            case 'premium':
                errorMessage = `Fichier trop volumineux (${formatFileSize(file.size)}). Limite Premium : 50 MB.`
                break
            default:
                errorMessage = `Fichier trop volumineux. Limite autorisée : ${limit.maxSizeFormatted}. Taille actuelle : ${formatFileSize(file.size)}`
        }

        return {
            isValid: false,
            error: errorMessage
        }
    }

    return { isValid: true }
}

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export const getFileSizeMessage = (userRole: string): string => {
    const limit = getFileLimit(userRole)

    switch (userRole) {
        case 'guest':
            return `Limite : ${limit.maxSizeFormatted} (inscrivez-vous pour 5 MB)`
        case 'free':
            return `Limite : ${limit.maxSizeFormatted} (passez à Premium pour 50 MB)`
        case 'premium':
            return `Limite : ${limit.maxSizeFormatted}`
        default:
            return `Limite : ${limit.maxSizeFormatted}`
    }
}

