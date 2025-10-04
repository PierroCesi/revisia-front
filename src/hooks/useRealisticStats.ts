// hooks/useRealisticStats.ts
import { useState, useEffect } from 'react'

interface Stats {
    users: number
    qcm: number
    satisfaction: number
    usersChange: string
    period: string
}

export const useRealisticStats = (): Stats => {
    const [stats, setStats] = useState<Stats>({
        users: 0,
        qcm: 0,
        satisfaction: 0,
        usersChange: '',
        period: ''
    })

    useEffect(() => {
        const generateStats = () => {
            const now = new Date()
            const hour = now.getHours()
            const dayOfWeek = now.getDay()
            const month = now.getMonth()

            // Facteurs contextuels
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
            const isExamPeriod = month >= 4 && month <= 6 // Mai-Juin
            const isPeakHour = hour >= 9 && hour <= 21

            // Multiplicateurs réalistes
            const timeMultiplier = isPeakHour ? 1 : 0.4
            const weekendMultiplier = isWeekend ? 0.6 : 1
            const examMultiplier = isExamPeriod ? 1.3 : 1

            // Base + variation horaire + facteurs contextuels
            const baseUsers = 12000
            const hourlyVariation = hour * 150
            const users = Math.floor(
                (baseUsers + hourlyVariation) * timeMultiplier * weekendMultiplier * examMultiplier
            )

            const baseQcm = 85000
            const qcmHourlyVariation = hour * 200
            const qcm = Math.floor(
                (baseQcm + qcmHourlyVariation) * timeMultiplier * weekendMultiplier * examMultiplier
            )

            // Satisfaction avec petite variation réaliste
            const satisfaction = 4.8 + (Math.random() * 0.2)

            // Changements contextuels
            const usersChange = isExamPeriod ? '+45% ce mois' : '+23% ce mois'
            const period = isExamPeriod ? 'Période d\'examens' : 'Cette semaine'

            setStats({
                users,
                qcm,
                satisfaction: Math.round(satisfaction * 10) / 10,
                usersChange,
                period
            })
        }

        // Générer les stats initiales
        generateStats()

        // Mettre à jour toutes les 5 minutes pour simuler l'activité
        const interval = setInterval(generateStats, 5 * 60 * 1000)

        return () => clearInterval(interval)
    }, [])

    return stats
}