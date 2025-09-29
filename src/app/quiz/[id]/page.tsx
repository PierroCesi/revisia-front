'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { documentsAPI, lessonsAPI, Question, Document } from '@/lib/api';
import { Button, Card, Typography, Badge } from '@/components/ui';
import { Brain, ArrowLeft, ArrowRight, CheckCircle, RotateCcw } from 'lucide-react';
import ConfettiAnimation from '@/components/ConfettiAnimation';

interface QuizPageProps {
    params: {
        id: string;
    };
}

export default function QuizPage({ params }: QuizPageProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
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

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && params.id) {
            const loadQuiz = async () => {
                try {
                    const lessonId = parseInt(params.id);
                    const lessonData = await lessonsAPI.getById(lessonId);

                    setDocument({
                        id: lessonData.lesson.id,
                        title: lessonData.lesson.title,
                        file_type: '',
                        created_at: lessonData.lesson.created_at
                    });
                    setQuestions(lessonData.questions);
                } catch (error) {
                    console.error('Erreur lors du chargement du quiz:', error);
                } finally {
                    setQuizLoading(false);
                }
            };
            loadQuiz();
        }
    }, [user, params.id]);

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
        if (!user || !params.id) return;

        setSubmittingAnswers(true);
        try {
            const lessonId = parseInt(params.id);

            // Soumettre toutes les réponses
            for (const question of questions) {
                if (question.question_type === 'qcm') {
                    const selectedAnswerId = selectedAnswers[question.id];
                    if (selectedAnswerId) {
                        await lessonsAPI.submitAnswer(lessonId, {
                            question_id: question.id,
                            selected_answer_id: selectedAnswerId
                        });
                    }
                } else {
                    const openAnswer = openAnswers[question.id];
                    if (openAnswer) {
                        await lessonsAPI.submitAnswer(lessonId, {
                            question_id: question.id,
                            open_answer: openAnswer
                        });
                    }
                }
            }

            setShowResults(true);

            // Vérifier si le score est >= 80% pour déclencher les confettis
            const { correct, total } = getScore();
            const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
            if (percentage >= 80) {
                setShowConfetti(true);
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
        if (!params.id) return;

        setResettingQuiz(true);
        setShowConfetti(false); // Réinitialiser les confettis
        try {
            const lessonId = parseInt(params.id);
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

    if (!user || !document || questions.length === 0) {
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
                            Ce quiz n'existe pas ou a été supprimé
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

                {/* Navigation */}
                <nav className="glass-card border-b-0 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                                    <Brain className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <Link href="/dashboard">
                                    <Typography variant="h4" className="font-bold text-foreground">
                                        Révisia
                                    </Typography>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Results */}
                <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                    <Card className="widget-card p-8 text-center">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Typography variant="h2" className="text-3xl font-bold text-foreground">
                                    Résultats du Quiz
                                </Typography>
                                <Typography variant="h4" className="text-orange-700">
                                    {document.title}
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

            {/* Navigation */}
            <nav className="glass-card border-b-0 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                                <Brain className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <Link href="/dashboard">
                                <Typography variant="h4" className="font-bold text-foreground">
                                    Révisia
                                </Typography>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-orange-soft text-orange-700">
                                Question {currentQuestionIndex + 1} sur {questions.length}
                            </Badge>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Progress Bar */}
            <div className="glass-card border-b-0">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
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
        </div>
    );
}
