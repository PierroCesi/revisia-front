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
  metadataBase: new URL('https://revisia-app.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://revisia-app.fr',
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
    videos: [
      {
        url: 'https://revisia-app.fr/videos/demo.mp4',
        type: 'video/mp4',
        width: 1920,
        height: 1080,
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
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
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

        {/* Métadonnées vidéo pour le partage social */}
        <meta property="og:video" content="https://revisia-app.fr/videos/demo.mp4" />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="1920" />
        <meta property="og:video:height" content="1080" />
        <meta property="og:video:secure_url" content="https://revisia-app.fr/videos/demo.mp4" />
        <meta property="og:video:duration" content="30" />

        {/* Métadonnées supplémentaires pour Facebook */}
        <meta property="og:video:url" content="https://revisia-app.fr/videos/demo.mp4" />
        <meta property="og:video:tag" content="IA, QCM, révisions, éducation" />
        <meta property="og:video:stream" content="https://revisia-app.fr/videos/demo.mp4" />
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
