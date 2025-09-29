"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { Brain, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Révisia</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-orange-600 transition-colors"
                        >
                            Accueil
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-600 hover:text-orange-600 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">{user.username}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Déconnexion</span>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">
                                        Inscription
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-orange-600 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-orange-600 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Accueil
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-600 hover:text-orange-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">{user.username}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center space-x-1"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Déconnexion</span>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            Connexion
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button size="sm" className="w-full">
                                            Inscription
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
