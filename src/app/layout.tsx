import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RevisIA - Générateur de QCM par IA",
    template: "%s | RevisIA"
  },
  description:
    "Générateur de QCM automatique. Transformez vos documents en quiz personnalisés pour optimiser vos révisions. Créateur de QCM par IA pour étudiants et professionnels.",
  keywords: [
    "générateur QCM ia",
    "révisions par ia",
    "créateur de QCM automatique",
    "qcm à partir de photo",
    "qcm à partir de document",
    "QCM IA",
    "générateur de quiz intelligent",
    "QCM automatique",
    "créateur de quiz par IA",
    "générateur de révisions",
    "questions de révision IA",
    "QCM par IA",
    "quiz automatique",
  ],
  authors: [{ name: "RevisIA Team" }],
  creator: "RevisIA",
  publisher: "RevisIA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://revisia.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://revisia.app',
    title: 'RevisIA - Générateur de QCM par IA',
    description: 'Générateur de QCM automatique. Transformez vos documents en quiz personnalisés pour optimiser vos révisions.',
    siteName: 'RevisIA',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'RevisIA - Plateforme de révisions intelligente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RevisIA - Générateur de QCM par IA',
    description: 'Générateur de QCM automatique. Transformez vos documents en quiz personnalisés pour optimiser vos révisions.',
    images: ['/og-image.svg'],
    creator: '@revisia_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <StructuredData type="website" />
        <StructuredData type="organization" />
        <StructuredData type="product" />
      </head>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
