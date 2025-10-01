"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui';
import { Brain, User, LogOut, Menu, X, Settings, Crown, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useState, useEffect, useRef } from 'react';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { isPremium, roleInfo } = useUserRole();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Debug logs
    console.log('Header Debug:', {
        user: user?.username,
        isPremium,
        role: roleInfo?.role,
        userIsPremium: user?.is_premium
    });

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    // Fermer le menu utilisateur quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Révisia</span>
                        {user && isPremium && (
                            <Badge variant="secondary" size="sm" className="bg-orange-soft text-orange-700 border-0 shadow-sm">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                            </Badge>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {!user && (
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-orange-600 transition-colors"
                            >
                                Accueil
                            </Link>
                        )}
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-600 hover:text-orange-600 transition-colors"
                                >
                                    Dashboard
                                </Link>

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <span className="text-sm font-medium">{user.username || user.email}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{user.username || user.email}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link
                                                href="/profile"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Mon Profil</span>
                                            </Link>

                                            {!isPremium && (
                                                <Link
                                                    href="/pricing"
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <Crown className="w-4 h-4" />
                                                    <span>Passer à Premium</span>
                                                </Link>
                                            )}

                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Déconnexion</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/pricing"
                                    className="text-gray-600 hover:text-orange-600 transition-colors"
                                >
                                    Tarifs
                                </Link>
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
                            {!user && (
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-orange-600 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Accueil
                                </Link>
                            )}
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-600 hover:text-orange-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="text-gray-600 hover:text-orange-600 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Mon Profil
                                    </Link>
                                    {!isPremium && (
                                        <Link
                                            href="/pricing"
                                            className="text-gray-600 hover:text-orange-600 transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Passer à Premium
                                        </Link>
                                    )}
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
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
