'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { lessonsAPI, Question, Document } from '@/lib/api';
import { Button, Card, Typography, Badge, ErrorAlert } from '@/components/ui';
import { Brain, ArrowLeft, ArrowRight, RotateCcw, UserPlus, Lock } from 'lucide-react';
import ConfettiAnimation from '@/components/ConfettiAnimation';
import { useUserRole } from '@/hooks/useUserRole';
import { useGuestSession } from '@/hooks/useGuestSession';

interface QuizPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function QuizPage({ params }: QuizPageProps) {
    const { user, loading } = useAuth();
    const { refreshRoleInfo } = useUserRole();
    const { sessionId, isGuest, createGuestSession } = useGuestSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = use(params);

    // Récupérer session_id depuis l'URL
    const urlSessionId = searchParams.get('session_id');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [document, setDocument] = useState<Document | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [openAnswers, setOpenAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);
    const [quizLoading, setQuizLoading] = useState(true);
    const [submittingAnswers, setSubmittingAnswers] = useState(false);
    const [resettingQuiz, setResettingQuiz] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guestResults, setGuestResults] = useState<{
        lesson_id: number;
        lesson_title: string;
        is_completed: boolean;
        total_questions: number;
        answered_questions: number;
        correct_answers: number;
        score_percentage: number;
        session_id: string;
        can_see_results: boolean;
    } | null>(null);

    // État local pour détecter si on est invité
    const [isGuestLocal, setIsGuestLocal] = useState(false);

    // Détecter si on est invité
    useEffect(() => {
        const hasToken = !!localStorage.getItem('access_token');
        const hasGuestSession = !!localStorage.getItem('guest_session_id');
        const isGuestDetected = !hasToken || hasGuestSession;

        console.log('Détection invité:', { hasToken, hasGuestSession, isGuestDetected });
        setIsGuestLocal(isGuestDetected);
    }, [loading, user]);

    useEffect(() => {
        // Debug: afficher l'état actuel
        console.log('Quiz Page - État:', { loading, user: !!user, isGuest, isGuestLocal, sessionId });

        // Ne rediriger que si on n'est ni connecté ni invité ET que le chargement est terminé
        if (!loading && !user && !isGuest && !isGuestLocal) {
            console.log('Redirection vers login - pas d\'utilisateur et pas invité');
            router.push('/login');
        }
    }, [user, loading, isGuest, isGuestLocal, router, sessionId]);

    useEffect(() => {
        console.log('Quiz Page - Chargement:', { user: !!user, isGuest, isGuestLocal, id, sessionId, urlSessionId });

        if ((user || isGuest || isGuestLocal) && id) {
            const loadQuiz = async () => {
                try {
                    setError(null);
                    const lessonId = parseInt(id);
                    // Utiliser sessionId de l'URL en priorité, sinon celui du localStorage
                    const currentSessionId = urlSessionId || sessionId;
                    console.log('Chargement du quiz:', { lessonId, currentSessionId });
                    const lessonData = await lessonsAPI.getById(lessonId, currentSessionId || undefined);

                    setDocument({
                        id: lessonData.lesson.id,
                        title: lessonData.lesson.title,
                        file_type: '',
                        created_at: lessonData.lesson.created_at
                    });
                    setQuestions(lessonData.questions);

                    // Si on est invité et qu'on reçoit un session_id, le sauvegarder
                    if ((isGuest || isGuestLocal) && lessonData.session_id && !currentSessionId) {
                        createGuestSession(lessonData.session_id);
                    }

                    // Rafraîchir les informations de rôle après le début du quiz (seulement pour les utilisateurs connectés)
                    if (user) {
                        refreshRoleInfo();
                    }
                } catch (error: unknown) {
                    console.error('Erreur lors du chargement du quiz:', error);

                    // Extraire le message d'erreur de la réponse
                    let errorMessage = 'Erreur lors du chargement du quiz.';

                    const errorWithResponse = error as { response?: { data?: { error?: string; details?: string } }; message?: string };
                    if (errorWithResponse?.response?.data?.error) {
                        errorMessage = errorWithResponse.response.data.error;
                    } else if (errorWithResponse?.response?.data?.details) {
                        errorMessage = errorWithResponse.response.data.details;
                    } else if (errorWithResponse?.message) {
                        errorMessage = errorWithResponse.message;
                    }

                    setError(errorMessage);
                } finally {
                    setQuizLoading(false);
                }
            };
            loadQuiz();
        }
    }, [user, isGuest, isGuestLocal, id, urlSessionId, createGuestSession, refreshRoleInfo, sessionId]);

    const handleAnswerSelect = (questionId: number, answerId: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleOpenAnswerChange = (questionId: number, answer: string) => {
        setOpenAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const submitAllAnswers = async () => {
        if ((!user && !isGuest && !isGuestLocal) || !id) return;

        setSubmittingAnswers(true);
        try {
            const lessonId = parseInt(id);
            // Utiliser sessionId de l'URL en priorité, sinon celui du localStorage
            const currentSessionId = urlSessionId || sessionId;

            // Soumettre toutes les réponses
            for (const question of questions) {
                if (question.question_type === 'qcm') {
                    const selectedAnswerId = selectedAnswers[question.id];
                    if (selectedAnswerId) {
                        await lessonsAPI.submitAnswer(lessonId, {
                            question_id: question.id,
                            selected_answer_id: selectedAnswerId,
                            ...((isGuest || isGuestLocal) && currentSessionId ? { session_id: currentSessionId } : {})
                        });
                    }
                } else {
                    const openAnswer = openAnswers[question.id];
                    if (openAnswer) {
                        await lessonsAPI.submitAnswer(lessonId, {
                            question_id: question.id,
                            open_answer: openAnswer,
                            ...((isGuest || isGuestLocal) && currentSessionId ? { session_id: currentSessionId } : {})
                        });
                    }
                }
            }

            // Si on est invité, récupérer les résultats (sans les afficher)
            if ((isGuest || isGuestLocal) && currentSessionId) {
                const results = await lessonsAPI.getGuestResults(lessonId, currentSessionId);
                setGuestResults(results);
            }

            setShowResults(true);

            // Vérifier si le score est >= 80% pour déclencher les confettis (seulement pour les utilisateurs connectés)
            if (user) {
                const { correct, total } = getScore();
                const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
                if (percentage >= 80) {
                    setShowConfetti(true);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la soumission des réponses:', error);
        } finally {
            setSubmittingAnswers(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            submitAllAnswers();
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const resetQuiz = async () => {
        if (!id) return;

        setResettingQuiz(true);
        setShowConfetti(false); // Réinitialiser les confettis
        try {
            const lessonId = parseInt(id);
            await lessonsAPI.reset(lessonId);

            // Réinitialiser l'état du quiz
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setOpenAnswers({});
            setShowResults(false);

            // Recharger les données du quiz
            const lessonData = await lessonsAPI.getById(lessonId);
            setQuestions(lessonData.questions);
        } catch (error) {
            console.error('Erreur lors de la réinitialisation du quiz:', error);
        } finally {
            setResettingQuiz(false);
        }
    };

    const getScore = () => {
        let correct = 0;
        questions.forEach(question => {
            if (question.question_type === 'qcm') {
                const selectedAnswerId = selectedAnswers[question.id];
                const correctAnswer = question.answers.find(answer => answer.is_correct);
                if (selectedAnswerId === correctAnswer?.id) {
                    correct++;
                }
            }
        });
        return { correct, total: questions.filter(q => q.question_type === 'qcm').length };
    };

    if (loading || quizLoading) {
        return (
            <div className="min-h-screen dashboard-gradient flex items-center justify-center">
                <Card className="widget-card p-8">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-orange-soft rounded-xl flex items-center justify-center mx-auto">
                            <Brain className="w-6 h-6 text-orange-700 animate-pulse" />
                        </div>
                        <Typography variant="h5" className="font-semibold text-foreground">
                            Chargement du quiz...
                        </Typography>
                    </div>
                </Card>
            </div>
        );
    }

    // Afficher l'erreur si elle existe (limite de tentatives, etc.)
    if (error) {
        return (
            <div className="min-h-screen dashboard-gradient flex items-center justify-center">
                <Card className="widget-card p-8 text-center max-w-md">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-soft rounded-xl flex items-center justify-center mx-auto">
                            <Brain className="w-8 h-8 text-red-700" />
                        </div>
                        <Typography variant="h4" className="font-bold text-foreground">
                            Accès refusé
                        </Typography>
                        <Typography variant="body" color="muted">
                            {error}
                        </Typography>
                        <div className="flex space-x-3 justify-center">
                            <Link href="/dashboard">
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Retour au tableau de bord
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button className="bg-orange-primary text-white hover:bg-orange-700">
                                    Passer à Premium
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if ((!user && !isGuest && !isGuestLocal) || !document || questions.length === 0) {
        return (
            <div className="min-h-screen dashboard-gradient flex items-center justify-center">
                <Card className="widget-card p-8 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-soft rounded-xl flex items-center justify-center mx-auto">
                            <Brain className="w-8 h-8 text-red-700" />
                        </div>
                        <Typography variant="h4" className="font-bold text-foreground">
                            Quiz non trouvé
                        </Typography>
                        <Typography variant="body" color="muted">
                            Ce quiz n&apos;existe pas ou a été supprimé
                        </Typography>
                        <Link href="/dashboard">
                            <Button className="bg-orange-primary text-white hover:bg-orange-700">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour au tableau de bord
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    if (showResults) {
        // Affichage différent pour les invités et les utilisateurs connectés
        if ((isGuest || isGuestLocal) && guestResults) {
            return (
                <div className="min-h-screen dashboard-gradient relative overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-soft/20 rounded-full blur-xl animate-float"></div>
                        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-soft/20 rounded-full blur-xl animate-float-delayed"></div>
                        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-soft/20 rounded-full blur-xl animate-float"></div>
                    </div>

                    {/* Résultats pour invités - sans afficher le score */}
                    <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                        <Card className="widget-card p-8 text-center">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="w-16 h-16 bg-orange-soft rounded-xl flex items-center justify-center mx-auto">
                                        <Lock className="w-8 h-8 text-orange-700" />
                                    </div>
                                    <Typography variant="h2" className="text-3xl font-bold text-foreground">
                                        Quiz Terminé !
                                    </Typography>
                                    <Typography variant="h4" className="text-orange-700">
                                        {document?.title}
                                    </Typography>
                                </div>

                                <div className="space-y-4">
                                    <Typography variant="body" className="text-lg text-muted-foreground">
                                        Quiz terminé ! Vous avez répondu à {guestResults.answered_questions} questions sur {guestResults.total_questions}.
                                    </Typography>

                                    <div className="bg-orange-soft/30 rounded-xl p-6 border border-orange-200">
                                        <Typography variant="body" className="text-orange-800 font-medium">
                                            🎯 Vous avez répondu à {guestResults.answered_questions} questions sur {guestResults.total_questions}
                                        </Typography>
                                        <Typography variant="body" className="text-orange-700 mt-2">
                                            Inscrivez-vous pour voir votre score détaillé et sauvegarder vos résultats !
                                        </Typography>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/register">
                                        <Button className="bg-orange-primary text-white hover:bg-orange-700">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            S&apos;inscrire pour voir les résultats
                                        </Button>
                                    </Link>
                                    <Link href="/">
                                        <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Retour à l&apos;accueil
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </main>
                </div>
            );
        }

        // Affichage normal pour les utilisateurs connectés
        const { correct, total } = getScore();
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

        return (
            <div className="min-h-screen dashboard-gradient relative overflow-hidden">
                {/* Animation de confettis pour score >= 80% */}
                <ConfettiAnimation isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-soft/20 rounded-full blur-xl animate-float"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-orange-soft/20 rounded-full blur-xl animate-float-delayed"></div>
                    <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-soft/20 rounded-full blur-xl animate-float"></div>
                </div>

                {/* Results */}
                <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                    <Card className="widget-card p-8 text-center">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Typography variant="h2" className="text-3xl font-bold text-foreground">
                                    Résultats du Quiz
                                </Typography>
                                <Typography variant="h4" className="text-orange-700">
                                    {document?.title}
                                </Typography>
                            </div>

                            <div className="space-y-4">
                                <div className="text-6xl font-bold text-orange-700 mb-2">{percentage}%</div>
                                <Typography variant="body" className="text-lg text-muted-foreground">
                                    {correct} bonnes réponses sur {total} questions QCM
                                </Typography>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={resetQuiz}
                                    disabled={resettingQuiz}
                                    className="bg-orange-primary text-white hover:bg-orange-700"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    {resettingQuiz ? 'Réinitialisation...' : 'Refaire le quiz'}
                                </Button>
                                <Link href="/dashboard">
                                    <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Retour au tableau de bord
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen dashboard-gradient relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-soft/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-orange-soft/20 rounded-full blur-xl animate-float-delayed"></div>
                <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-soft/20 rounded-full blur-xl animate-float"></div>
            </div>

            {/* Progress Bar */}
            <div className="glass-card border-b-0">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden mr-4">
                            <div
                                className="h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <Badge variant="secondary" className="bg-orange-soft text-orange-700">
                            Question {currentQuestionIndex + 1} sur {questions.length}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Quiz Content */}
            <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                <Card className="widget-card p-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Badge
                                variant={currentQuestion.difficulty === 'easy' ? 'success' :
                                    currentQuestion.difficulty === 'medium' ? 'warning' : 'error'}
                                className="text-xs"
                            >
                                {currentQuestion.difficulty === 'easy' ? 'Facile' :
                                    currentQuestion.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                            </Badge>
                            <Badge variant="secondary" className="bg-blue-soft text-blue-700 text-xs">
                                {currentQuestion.question_type === 'qcm' ? 'QCM' : 'Question ouverte'}
                            </Badge>
                        </div>

                        <Typography variant="h3" className="font-semibold text-foreground leading-relaxed">
                            {currentQuestion.question_text}
                        </Typography>

                        {currentQuestion.question_type === 'qcm' ? (
                            <div className="space-y-3">
                                {currentQuestion.answers.map((answer) => (
                                    <button
                                        key={answer.id}
                                        onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                        className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${selectedAnswers[currentQuestion.id] === answer.id
                                            ? 'border-orange-500 bg-orange-soft/30 shadow-md'
                                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-soft/10'
                                            }`}
                                    >
                                        <Typography variant="body" className="text-foreground">
                                            {answer.answer_text}
                                        </Typography>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <textarea
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    rows={4}
                                    placeholder="Tapez votre réponse ici..."
                                    value={openAnswers[currentQuestion.id] || ''}
                                    onChange={(e) => handleOpenAnswerChange(currentQuestion.id, e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </main>

            {/* Navigation Buttons */}
            <div className="max-w-4xl mx-auto px-6 pb-8 relative z-10">
                <div className="flex justify-between">
                    <Button
                        onClick={previousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Précédent
                    </Button>

                    <Button
                        onClick={nextQuestion}
                        disabled={submittingAnswers}
                        className="bg-orange-primary text-white hover:bg-orange-700"
                    >
                        {submittingAnswers ? 'Soumission...' :
                            currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
                        {currentQuestionIndex !== questions.length - 1 && (
                            <ArrowRight className="w-4 h-4 ml-2" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <ErrorAlert
                    message={error}
                    onDismiss={() => setError(null)}
                    onRetry={() => {
                        setError(null);
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
