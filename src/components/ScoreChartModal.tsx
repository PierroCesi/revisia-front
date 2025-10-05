'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Typography, AlertDialog } from '@/components/ui';
import { X, TrendingUp, BarChart3, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import AttemptDetailsModal from './AttemptDetailsModal';

interface ScoreChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonId: number;
    lessonTitle: string;
    lessonAverageScore?: number;
    onDelete?: (lessonId: number) => void;
}

interface ScoreData {
    attempt: number;
    score: number;
    date: string;
}


export default function ScoreChartModal({ isOpen, onClose, lessonId, lessonTitle, lessonAverageScore, onDelete }: ScoreChartModalProps) {
    const [scoreHistory, setScoreHistory] = useState<ScoreData[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');
    const [showAttemptDetails, setShowAttemptDetails] = useState(false);
    const [selectedAttempt, setSelectedAttempt] = useState<{
        attempt_number: number;
        score: number;
        completed_at: string;
        user_answers: Array<{
            question_id: number;
            question_text: string;
            difficulty: 'easy' | 'medium' | 'hard';
            user_answer_id: number | null;
            user_answer_text: string | null;
            is_correct: boolean;
            all_answers: Array<{
                id: number;
                text: string;
                is_correct: boolean;
            }>;
        }>;
    } | null>(null);

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

    const handleDeleteConfirm = async () => {
        if (!onDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(lessonId);
            setShowDeleteDialog(false);
            onClose(); // Fermer la modal après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAttemptClick = async (attemptNumber: number) => {
        try {
            const { lessonsAPI } = await import('@/lib/api');
            const attempts = await lessonsAPI.getAttempts(lessonId);
            const attemptData = attempts.find(attempt => attempt.attempt_number === attemptNumber);

            if (attemptData) {
                setSelectedAttempt(attemptData);
                setShowAttemptDetails(true);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des détails de la tentative:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <Card className="widget-card max-w-4xl w-full p-4 sm:p-6 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-soft rounded-xl flex items-center justify-center p-2">
                            <BarChart3 className="w-6 h-6 text-orange-700" />
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
                    <div className="flex items-center space-x-2">
                        {onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                                title="Supprimer cette leçon"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="p-2"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 text-center hover:shadow-md transition-shadow duration-200">
                        <Typography variant="h4" className="font-bold text-orange-700 mb-1">
                            {averageScore}%
                        </Typography>
                        <Typography variant="caption" color="muted" className="break-words">Score moyen</Typography>
                    </Card>
                    <Card className="p-4 text-center hover:shadow-md transition-shadow duration-200">
                        <Typography variant="h4" className="font-bold text-green-600 mb-1">
                            {bestScore}%
                        </Typography>
                        <Typography variant="caption" color="muted" className="break-words">Meilleur score</Typography>
                    </Card>
                    <Card className="p-4 text-center hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
                        <Typography variant="h4" className={`font-bold mb-1 ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {improvement >= 0 ? '+' : ''}{improvement}%
                        </Typography>
                        <Typography variant="caption" color="muted" className="break-words">Progression</Typography>
                    </Card>
                </div>

                {/* Attempts List */}
                <div className="mb-6">
                    <Typography variant="h6" className="font-semibold mb-4">
                        Historique des tentatives
                    </Typography>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {scoreHistory.map((attempt) => (
                            <Card
                                key={attempt.attempt}
                                className="p-3 cursor-pointer hover:shadow-md transition-shadow duration-200"
                                onClick={() => handleAttemptClick(attempt.attempt)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Typography variant="caption" className="font-bold text-orange-700">
                                                {attempt.attempt}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body" className="font-medium">
                                                Tentative {attempt.attempt}
                                            </Typography>
                                            <Typography variant="caption" color="muted">
                                                {attempt.date}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Typography variant="h6" className={`font-bold ${attempt.score >= 80 ? 'text-green-600' :
                                            attempt.score >= 60 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {attempt.score}%
                                        </Typography>
                                        <Typography variant="caption" color="muted">
                                            Cliquez pour voir les détails
                                        </Typography>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Chart Instructions */}
                <div className="text-center mb-4">
                    <Typography variant="caption" color="muted" className="text-sm">
                        💡 Cliquez sur un point ou une barre pour voir le détail des réponses
                    </Typography>
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
                <div className="h-64 sm:h-80 mb-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Typography variant="body" color="muted">Chargement...</Typography>
                        </div>
                    ) : scoreHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line' ? (
                                <LineChart data={scoreHistory} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10 }}
                                        interval="preserveStartEnd"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => `${value}%`}
                                        width={40}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, 'Score']}
                                        labelFormatter={(label) => label}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px',
                                            padding: '8px'
                                        }}
                                        wrapperStyle={{ outline: 'none' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#ea580c"
                                        strokeWidth={2}
                                        dot={{
                                            fill: '#ea580c',
                                            strokeWidth: 2,
                                            r: 4,
                                            cursor: 'pointer'
                                        }}
                                        activeDot={{
                                            r: 6,
                                            stroke: '#ea580c',
                                            strokeWidth: 2,
                                            cursor: 'pointer'
                                        }}
                                        onClick={(data) => {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const chartData = data as any;
                                            if (chartData && chartData.attempt) {
                                                handleAttemptClick(chartData.attempt);
                                            }
                                        }}
                                    />
                                </LineChart>
                            ) : (
                                <BarChart data={scoreHistory} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="attempt"
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => `E${value}`}
                                        width={40}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(value) => `${value}%`}
                                        width={40}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [`${value}%`, 'Score']}
                                        labelFormatter={(label) => `Essai ${label}`}
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px',
                                            padding: '8px'
                                        }}
                                        wrapperStyle={{ outline: 'none' }}
                                    />
                                    <Bar
                                        dataKey="score"
                                        fill="#ea580c"
                                        radius={[4, 4, 0, 0]}
                                        cursor="pointer"
                                        onClick={(data) => {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const chartData = data as any;
                                            if (chartData && chartData.attempt) {
                                                handleAttemptClick(chartData.attempt);
                                            }
                                        }}
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la leçon"
                description={`Êtes-vous sûr de vouloir supprimer définitivement la leçon "${lessonTitle}" ? Cette action supprimera également toutes les questions et réponses associées.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="destructive"
                isLoading={isDeleting}
            />

            {/* Attempt Details Modal */}
            {selectedAttempt && (
                <AttemptDetailsModal
                    isOpen={showAttemptDetails}
                    onClose={() => {
                        setShowAttemptDetails(false);
                        setSelectedAttempt(null);
                    }}
                    attemptData={selectedAttempt}
                    lessonTitle={lessonTitle}
                />
            )}
        </div>
    );
}
