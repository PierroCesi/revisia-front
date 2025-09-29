"use client"

import type React from "react"

import { Button, Card, Badge } from "@/components/ui"
import {
    Camera,
    FileText,
    Zap,
    Brain,
    Users,
    Sparkles,
    Upload,
    BarChart3,
    Clock,
    CheckCircle,
    TrendingUp,
    Target,
    Award,
    Search,
    Bell,
    Star,
    Play,
    ImageIcon,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export default function HomePage() {
    const [isDragOver, setIsDragOver] = useState(false)
    const { user, loading } = useAuth()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        // Handle file drop logic here
        console.log("[v0] Files dropped:", e.dataTransfer.files)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file selection logic here
        console.log("[v0] Files selected:", e.target.files)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dashboard-gradient relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-soft/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-orange-soft/20 rounded-full blur-xl animate-float-delayed"></div>
                <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-soft/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-soft/20 rounded-full blur-xl animate-float-delayed"></div>
            </div>


            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
                <section className="grid lg:grid-cols-12 gap-6">
                    {/* Main hero */}
                    <div className="lg:col-span-8">
                        <Card className="widget-card p-8 h-full">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Badge variant="secondary" className="bg-orange-soft text-orange-700 border-0 shadow-sm">
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Nouveau
                                    </Badge>
                                    <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
                                        Transformez vos <span className="text-orange-700">documents</span> en QCM intelligents
                                    </h1>
                                    <p className="text-lg text-muted-foreground text-balance max-w-2xl">
                                        Uploadez une photo ou un document, et notre IA génère automatiquement des questions flash
                                        personnalisées pour optimiser vos révisions.
                                    </p>
                                </div>

                                <div
                                    className={`upload-zone rounded-2xl p-8 text-center cursor-pointer ${isDragOver ? "drag-over" : ""}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById("file-input")?.click()}
                                >
                                    <input
                                        id="file-input"
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    <div className="space-y-4">
                                        <div className="flex justify-center space-x-2">
                                            <div className="w-12 h-12 bg-orange-primary/20 rounded-xl flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-orange-700" />
                                            </div>
                                            <div className="w-12 h-12 bg-orange-primary/20 rounded-xl flex items-center justify-center">
                                                <ImageIcon className="w-6 h-6 text-orange-700" />
                                            </div>
                                            <div className="w-12 h-12 bg-orange-primary/20 rounded-xl flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-orange-700" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-orange-700 mb-2">
                                                Glissez vos fichiers ici ou cliquez pour sélectionner
                                            </h3>
                                            <p className="text-muted-foreground">
                                                PDF, Word, images, photos manuscrites - Générez vos QCM en quelques secondes
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                                            <span className="bg-secondary px-2 py-1 rounded-md">.PDF</span>
                                            <span className="bg-secondary px-2 py-1 rounded-md">.DOC</span>
                                            <span className="bg-secondary px-2 py-1 rounded-md">.JPG</span>
                                            <span className="bg-secondary px-2 py-1 rounded-md">.PNG</span>
                                            <span className="bg-secondary px-2 py-1 rounded-md">Photos</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    {user ? (
                                        <Link href="/dashboard">
                                            <Button
                                                size="lg"
                                                className="bg-orange-primary text-white shadow-lg hover:shadow-xl transition-all hover:bg-orange-700"
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Accéder au tableau de bord
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/register">
                                            <Button
                                                size="lg"
                                                className="bg-orange-primary text-white shadow-lg hover:shadow-xl transition-all hover:bg-orange-700"
                                            >
                                                <ImageIcon className="w-4 h-4 mr-2" />
                                                Essayer gratuitement
                                            </Button>
                                        </Link>
                                    )}
                                    <Button variant="outline" size="lg" className="border-border bg-transparent hover:bg-secondary/50">
                                        <Play className="w-4 h-4 mr-2" />
                                        Voir la démo
                                    </Button>
                                </div>

                                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Gratuit</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Pas de carte bancaire</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Résultats instantanés</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                        <Card className="widget-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground">Utilisateurs actifs</h3>
                                <div className="w-8 h-8 bg-green-soft rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-green-700" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-3xl font-bold text-foreground">12,847</div>
                                <div className="text-sm text-muted-foreground">+23% ce mois</div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
                                </div>
                            </div>
                        </Card>

                        <Card className="widget-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground">QCM générés</h3>
                                <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-3xl font-bold text-foreground">89,234</div>
                                <div className="text-sm text-muted-foreground">Cette semaine</div>
                                <div className="flex space-x-1 h-8 items-end">
                                    {[40, 60, 30, 80, 50, 90, 70].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-primary rounded-sm transition-all duration-500 delay-100"
                                            style={{ height: `${height / 2}px` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <Card className="widget-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-foreground">Satisfaction</h3>
                                <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Star className="w-4 h-4 text-yellow-600" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="text-3xl font-bold text-foreground">4.9/5</div>
                                <div className="text-sm text-muted-foreground">2,847 avis</div>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                <section>
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-3">Comment ça marche</h2>
                        <p className="text-muted-foreground text-lg">Trois étapes simples pour révolutionner vos révisions</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Camera,
                                title: "1. Uploadez",
                                description: "Prenez une photo de vos notes ou uploadez un document PDF, Word ou image",
                                color: "bg-blue-soft",
                                iconColor: "text-blue-700",
                            },
                            {
                                icon: Zap,
                                title: "2. L'IA analyse",
                                description: "Notre IA extrait les concepts clés et génère des questions pertinentes",
                                color: "bg-orange-soft",
                                iconColor: "text-orange-700",
                            },
                            {
                                icon: Brain,
                                title: "3. Révisez",
                                description: "Répondez aux QCM et suivez votre progression en temps réel",
                                color: "bg-purple-soft",
                                iconColor: "text-purple-700",
                            },
                        ].map((step, index) => (
                            <Card
                                key={index}
                                className="widget-card p-8 text-center group hover:scale-105 transition-all duration-300"
                            >
                                <div
                                    className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-3 text-lg">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Fonctionnalités</h2>
                        <p className="text-muted-foreground">Tout ce dont vous avez besoin pour réviser efficacement</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: FileText,
                                title: "Multi-formats",
                                description: "PDF, Word, images, photos manuscrites",
                                color: "bg-blue-soft",
                                iconColor: "text-blue-700",
                            },
                            {
                                icon: Clock,
                                title: "Génération instantanée",
                                description: "Questions générées en quelques secondes",
                                color: "bg-green-soft",
                                iconColor: "text-green-700",
                            },
                            {
                                icon: Target,
                                title: "Questions intelligentes",
                                description: "QCM adaptés au niveau et au contenu",
                                color: "bg-purple-soft",
                                iconColor: "text-purple-700",
                            },
                            {
                                icon: Users,
                                title: "Partage facile",
                                description: "Partagez vos quiz avec vos amis",
                                color: "bg-orange-soft",
                                iconColor: "text-orange-700",
                            },
                            {
                                icon: BarChart3,
                                title: "Suivi des progrès",
                                description: "Analysez vos performances",
                                color: "bg-pink-soft",
                                iconColor: "text-pink-700",
                            },
                            {
                                icon: Award,
                                title: "Mode révision rapide",
                                description: "Questions flash pour réviser vite",
                                color: "bg-blue-soft",
                                iconColor: "text-blue-700",
                            },
                        ].map((feature, index) => (
                            <Card key={index} className="widget-card p-6">
                                <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <Card className="widget-card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-soft/20 to-purple-soft/10"></div>
                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold text-foreground">Prêt à révolutionner vos révisions ?</h2>
                                <p className="text-xl text-muted-foreground">
                                    Rejoignez des milliers d&apos;étudiants qui utilisent déjà RevisIA
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {user ? (
                                    <Link href="/dashboard">
                                        <Button
                                            size="lg"
                                            className="bg-orange-primary text-white shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-4 hover:bg-orange-700"
                                        >
                                            <ImageIcon className="w-5 h-5 mr-2" />
                                            Accéder au tableau de bord
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/register">
                                        <Button
                                            size="lg"
                                            className="bg-orange-primary text-white shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-4 hover:bg-orange-700"
                                        >
                                            <ImageIcon className="w-5 h-5 mr-2" />
                                            Commencer gratuitement
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-border bg-transparent hover:bg-secondary/50 text-lg px-8 py-4"
                                >
                                    Planifier une démo
                                </Button>
                            </div>

                            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                    <span>12,847 utilisateurs</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-orange-primary rounded-full"></div>
                                    <span>89,234 QCM générés</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span>4.9/5 étoiles</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
            </main>

        </div>
    )
}
