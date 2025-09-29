'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Typography } from '@/components/ui';
import { X, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ScoreChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: number;
    lessonTitle: string;
    lessonAverageScore?: number;
}

interface ScoreData {
    attempt: number;
    score: number;
    date: string;
}

export default function ScoreChartModal({ isOpen, onClose, lessonId, lessonTitle, lessonAverageScore }: ScoreChartModalProps) {
    const [scoreHistory, setScoreHistory] = useState<ScoreData[]>([]);
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');

    const loadScoreHistory = useCallback(async () => {
        setLoading(true);
        try {
            const { lessonsAPI } = await import('@/lib/api');
            const attempts = await lessonsAPI.getAttempts(lessonId);

            const scoreData: ScoreData[] = attempts.map(attempt => ({
                attempt: attempt.attempt_number,
                score: attempt.score,
                date: new Date(attempt.completed_at).toLocaleDateString('fr-FR')
            }));

            setScoreHistory(scoreData);
        } catch (error) {
            console.error('Erreur lors du chargement de l\'historique:', error);
            // Fallback sur des données mock si l'API échoue
            const mockData: ScoreData[] = [
                { attempt: 1, score: 60, date: '2024-01-15' },
                { attempt: 2, score: 75, date: '2024-01-16' },
                { attempt: 3, score: 80, date: '2024-01-17' },
            ];
            setScoreHistory(mockData);
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        if (isOpen && lessonId) {
            loadScoreHistory();
        }
    }, [isOpen, lessonId, loadScoreHistory]);

    if (!isOpen) return null;

    // Utiliser la moyenne du backend si disponible, sinon calculer depuis l'historique
    const averageScore = lessonAverageScore !== undefined
        ? Math.round(lessonAverageScore)
        : scoreHistory.length > 0
            ? Math.round(scoreHistory.reduce((sum, item) => sum + item.score, 0) / scoreHistory.length)
            : 0;

    const bestScore = scoreHistory.length > 0
        ? Math.max(...scoreHistory.map(item => item.score))
        : 0;

    const improvement = scoreHistory.length > 1
        ? scoreHistory[scoreHistory.length - 1].score - scoreHistory[0].score
        : 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="widget-card max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-soft rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-orange-700" />
                        </div>
                        <div>
                            <Typography variant="h5" className="font-bold text-foreground">
                                Historique des scores
                            </Typography>
                            <Typography variant="caption" color="muted">
                                {lessonTitle}
                            </Typography>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="p-2"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 text-center">
                        <Typography variant="h4" className="font-bold text-orange-700">
                            {averageScore}%
                        </Typography>
                        <Typography variant="caption" color="muted">Score moyen</Typography>
                    </Card>
                    <Card className="p-4 text-center">
                        <Typography variant="h4" className="font-bold text-green-600">
                            {bestScore}%
                        </Typography>
                        <Typography variant="caption" color="muted">Meilleur score</Typography>
                    </Card>
                    <Card className="p-4 text-center">
                        <Typography variant="h4" className={`font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {improvement >= 0 ? '+' : ''}{improvement}%
                        </Typography>
                        <Typography variant="caption" color="muted">Progression</Typography>
                    </Card>
                </div>

                {/* Chart Type Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="flex space-x-2">
                        <Button
                            variant={chartType === 'line' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('line')}
                            className={chartType === 'line' ? 'bg-orange-primary text-white' : ''}
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Ligne
                        </Button>
                        <Button
                            variant={chartType === 'bar' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setChartType('bar')}
                            className={chartType === 'bar' ? 'bg-orange-primary text-white' : ''}
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Barres
                        </Button>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-80 mb-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Typography variant="body" color="muted">Chargement...</Typography>
                        </div>
                    ) : scoreHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart data={scoreHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, 'Score']}
                                        labelFormatter={(label) => label}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#ea580c"
                                        strokeWidth={3}
                                        dot={{ fill: '#ea580c', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: '#ea580c', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            ) : (
                                <BarChart data={scoreHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="attempt"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `Essai ${value}`}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, 'Score']}
                                        labelFormatter={(label) => `Essai ${label}`}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="score"
                                        fill="#ea580c"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Typography variant="body" color="muted">
                                Aucun historique de scores disponible
                            </Typography>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Fermer
                    </Button>
                </div>
            </Card>
        </div>
    );
}
