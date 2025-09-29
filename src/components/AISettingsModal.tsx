'use client';

import { useState } from 'react';
import { Button, Card, Typography, Input } from '@/components/ui';
import { X, Brain, Settings } from 'lucide-react';

interface AISettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (settings: AISettings) => void;
    fileName: string;
}

export interface AISettings {
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    questionTypes: ('qcm' | 'open')[];
    educationLevel?: string;
}

export default function AISettingsModal({ isOpen, onClose, onConfirm, fileName }: AISettingsModalProps) {
    const [questionCount, setQuestionCount] = useState(5);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [educationLevel, setEducationLevel] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm({
            questionCount,
            difficulty,
            questionTypes: ['qcm'], // Seulement QCM
            educationLevel: educationLevel || undefined
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
            <Card className="widget-card max-w-md w-full p-6 relative">
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
                    <div>
                        <Typography variant="h6" className="font-semibold text-foreground mb-3">
                            Nombre de questions
                        </Typography>
                        <Input
                            type="number"
                            min="1"
                            max="20"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                            className="w-full"
                            placeholder="5"
                        />
                        <Typography variant="caption" color="muted" className="mt-1">
                            Entre 1 et 20 questions
                        </Typography>
                    </div>

                    {/* Difficulté */}
                    <div>
                        <Typography variant="h6" className="font-semibold text-foreground mb-3">
                            Niveau de difficulté
                        </Typography>
                        <div className="grid grid-cols-3 gap-2">
                            {(['easy', 'medium', 'hard'] as const).map((diff) => (
                                <Button
                                    key={diff}
                                    variant={difficulty === diff ? 'default' : 'outline'}
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
                    <div>
                        <Typography variant="h6" className="font-semibold text-foreground mb-3">
                            Niveau d'éducation
                        </Typography>
                        <select
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">Sélectionnez votre niveau</option>

                            <optgroup label="🏫 Collège">
                                <option value="6ème">6ème</option>
                                <option value="5ème">5ème</option>
                                <option value="4ème">4ème</option>
                                <option value="3ème">3ème</option>
                            </optgroup>

                            <optgroup label="🎓 Lycée">
                                <option value="2nde">2nde</option>
                                <option value="1ère">1ère</option>
                                <option value="Terminale">Terminale</option>
                                <option value="Bac Pro">Bac Pro</option>
                                <option value="Bac Techno">Bac Techno</option>
                                <option value="CAP">CAP</option>
                            </optgroup>

                            <optgroup label="🎓 Supérieur">
                                <option value="BTS">BTS</option>
                                <option value="DUT">DUT</option>
                                <option value="BUT">BUT</option>
                                <option value="Licence">Licence</option>
                                <option value="Licence Pro">Licence Pro</option>
                                <option value="Master">Master</option>
                                <option value="Master Pro">Master Pro</option>
                                <option value="Doctorat">Doctorat</option>
                                <option value="École d'ingénieur">École d'ingénieur</option>
                                <option value="École de commerce">École de commerce</option>
                                <option value="École spécialisée">École spécialisée</option>
                                <option value="Formation continue">Formation continue</option>
                            </optgroup>

                            <optgroup label="👨‍💼 Professionnel">
                                <option value="En activité">En activité</option>
                                <option value="En recherche d'emploi">En recherche d'emploi</option>
                                <option value="Retraité">Retraité</option>
                            </optgroup>

                            <option value="Autre">Autre</option>
                        </select>
                        <Typography variant="caption" color="muted" className="mt-1">
                            Pour adapter les questions à votre niveau
                        </Typography>
                    </div>

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
                            Questions ouvertes désactivées pour l'instant
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
