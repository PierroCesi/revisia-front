'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Typography, Input, Select, Textarea } from '@/components/ui';
import { X, Brain, Settings } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

interface AISettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (settings: AISettings) => void;
    fileName: string;
    userEducationLevel?: string;
}

export interface AISettings {
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    questionTypes: ('qcm' | 'open')[];
    educationLevel?: string;
    instructions?: string;
}

export default function AISettingsModal({ isOpen, onClose, onConfirm, fileName, userEducationLevel }: AISettingsModalProps) {
    const { maxQuestions, isGuest, isFree } = useUserRole();
    const [questionCount, setQuestionCount] = useState(Math.min(10, maxQuestions));
    const [questionCountInput, setQuestionCountInput] = useState(Math.min(10, maxQuestions).toString());
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [educationLevel, setEducationLevel] = useState(userEducationLevel || '');
    const [instructions, setInstructions] = useState('');

    // Mettre à jour le niveau d'éducation quand userEducationLevel change
    useEffect(() => {
        if (userEducationLevel) {
            setEducationLevel(userEducationLevel);
        }
    }, [userEducationLevel]);

    // Synchroniser l'input avec la valeur numérique quand maxQuestions change
    useEffect(() => {
        const newCount = Math.min(questionCount, maxQuestions);
        setQuestionCount(newCount);
        setQuestionCountInput(newCount.toString());
    }, [maxQuestions]);

    // Fonction pour gérer les changements dans l'input
    const handleQuestionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuestionCountInput(inputValue);

        // Si le champ est vide, on ne met pas à jour questionCount
        if (inputValue === '') {
            return;
        }

        // Sinon, on parse et valide la valeur
        const numericValue = parseInt(inputValue);
        if (!isNaN(numericValue) && numericValue > 0) {
            const validValue = Math.min(numericValue, maxQuestions);
            setQuestionCount(validValue);
            // Si la valeur a été tronquée, on met à jour l'input
            if (validValue !== numericValue) {
                setQuestionCountInput(validValue.toString());
            }
        }
    };

    // Fonction pour gérer la perte de focus (validation finale)
    const handleQuestionCountBlur = () => {
        if (questionCountInput === '') {
            // Si le champ est vide, on remet la valeur par défaut
            const defaultValue = Math.min(10, maxQuestions);
            setQuestionCount(defaultValue);
            setQuestionCountInput(defaultValue.toString());
        }
    };

    if (!isOpen) return null;

    const handleConfirm = () => {
        // S'assurer qu'on a une valeur valide pour questionCount
        let finalQuestionCount = questionCount;
        if (questionCountInput === '') {
            finalQuestionCount = Math.min(10, maxQuestions);
        }

        onConfirm({
            questionCount: finalQuestionCount,
            difficulty,
            questionTypes: ['qcm'], // Seulement QCM
            educationLevel: educationLevel || undefined,
            instructions: instructions.trim() || undefined
        });
        // Ne pas fermer la modal ici, elle sera fermée par le parent après génération
    };

    const getDifficultyLabel = (diff: string) => {
        const labels = {
            'easy': 'Facile',
            'medium': 'Moyen',
            'hard': 'Difficile'
        };
        return labels[diff as keyof typeof labels] || diff;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="widget-card max-w-md w-full p-6 relative h-[90vh] overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-soft rounded-xl flex items-center justify-center">
                            <Brain className="w-5 h-5 text-orange-700" />
                        </div>
                        <div>
                            <Typography variant="h5" className="font-bold text-foreground">
                                Configuration IA
                            </Typography>
                            <Typography variant="caption" color="muted">
                                {fileName}
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

                {/* Content */}
                <div className="space-y-6">
                    {/* Nombre de questions */}
                    <Input
                        label="Nombre de questions"
                        type="number"
                        min="1"
                        max={maxQuestions}
                        value={questionCountInput}
                        onChange={handleQuestionCountChange}
                        onBlur={handleQuestionCountBlur}
                        placeholder="5"
                        helperText={
                            isGuest ? `Mode test : maximum ${maxQuestions} questions` :
                                isFree ? `Compte gratuit : maximum ${maxQuestions} questions` :
                                    `Premium : maximum ${maxQuestions} questions`
                        }
                    />

                    {/* Difficulté */}
                    <div>
                        <Typography variant="h6" className="font-semibold text-foreground mb-3">
                            Niveau de difficulté
                        </Typography>
                        <div className="grid grid-cols-3 gap-2">
                            {(['easy', 'medium', 'hard'] as const).map((diff) => (
                                <Button
                                    key={diff}
                                    variant={difficulty === diff ? 'primary' : 'outline'}
                                    size="sm"
                                    onClick={() => setDifficulty(diff)}
                                    className={`text-xs ${difficulty === diff
                                        ? 'bg-orange-primary text-white'
                                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {getDifficultyLabel(diff)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Niveau d'éducation */}
                    <Select
                        label="Niveau d'éducation"
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        placeholder="Sélectionnez votre niveau"
                        helperText="Pour adapter les questions à votre niveau"
                        optGroups={[
                            {
                                label: "🏫 Collège",
                                options: [
                                    { value: "6ème", label: "6ème" },
                                    { value: "5ème", label: "5ème" },
                                    { value: "4ème", label: "4ème" },
                                    { value: "3ème", label: "3ème" }
                                ]
                            },
                            {
                                label: "🎓 Lycée",
                                options: [
                                    { value: "2nde", label: "2nde" },
                                    { value: "1ère", label: "1ère" },
                                    { value: "Terminale", label: "Terminale" },
                                    { value: "Bac Pro", label: "Bac Pro" },
                                    { value: "Bac Techno", label: "Bac Techno" },
                                    { value: "CAP", label: "CAP" }
                                ]
                            },
                            {
                                label: "🎓 Supérieur",
                                options: [
                                    { value: "BTS", label: "BTS" },
                                    { value: "DUT", label: "DUT" },
                                    { value: "BUT", label: "BUT" },
                                    { value: "Licence", label: "Licence" },
                                    { value: "Licence Pro", label: "Licence Pro" },
                                    { value: "Master", label: "Master" },
                                    { value: "Master Pro", label: "Master Pro" },
                                    { value: "Doctorat", label: "Doctorat" },
                                    { value: "École d'ingénieur", label: "École d'ingénieur" },
                                    { value: "École de commerce", label: "École de commerce" },
                                    { value: "École spécialisée", label: "École spécialisée" },
                                    { value: "Formation continue", label: "Formation continue" }
                                ]
                            },
                            {
                                label: "👨‍💼 Professionnel",
                                options: [
                                    { value: "En activité", label: "En activité" },
                                    { value: "En recherche d'emploi", label: "En recherche d'emploi" },
                                    { value: "Retraité", label: "Retraité" }
                                ]
                            }
                        ]}
                        options={[
                            { value: "Autre", label: "Autre" }
                        ]}
                    />

                    {/* Instructions personnalisées */}
                    <Textarea
                        label="Instructions personnalisées"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Ex: Concentrez-vous sur les chapitres 3 et 4, évitez les questions trop techniques, privilégiez les applications pratiques..."
                        rows={3}
                        helperText="Instructions optionnelles pour guider la génération des questions"
                    />

                    {/* Type de questions */}
                    <div>
                        <Typography variant="h6" className="font-semibold text-foreground mb-3">
                            Type de questions
                        </Typography>
                        <div className="flex items-center space-x-2 p-3 bg-green-soft/20 rounded-lg border border-green-200">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                <Settings className="w-3 h-3 text-white" />
                            </div>
                            <Typography variant="body" className="text-green-700 font-medium">
                                Questions à choix multiples (QCM)
                            </Typography>
                        </div>
                        <Typography variant="caption" color="muted" className="mt-1">
                            Questions ouvertes désactivées pour l&apos;instant
                        </Typography>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-8">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-1 bg-orange-primary text-white hover:bg-orange-700"
                    >
                        Générer les questions
                    </Button>
                </div>
            </Card>
        </div>
    );
}
