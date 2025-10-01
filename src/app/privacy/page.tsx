import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politique de confidentialité',
    description: 'Politique de confidentialité de RevisIA - Comment nous protégeons vos données personnelles.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Politique de confidentialité
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. Collecte des données
                            </h2>
                            <p className="text-gray-600 mb-4">
                                RevisIA collecte les données suivantes lorsque vous utilisez notre service :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Informations de compte (nom, email, mot de passe)</li>
                                <li>Documents et fichiers que vous uploadez</li>
                                <li>Questions et réponses générées par l&apos;IA</li>
                                <li>Données d&apos;utilisation et de performance</li>
                                <li>Informations techniques (adresse IP, navigateur)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. Utilisation des données
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Nous utilisons vos données pour :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Fournir et améliorer nos services</li>
                                <li>Générer des QCM personnalisés</li>
                                <li>Analyser les performances d&apos;apprentissage</li>
                                <li>Communiquer avec vous</li>
                                <li>Assurer la sécurité de notre plateforme</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Partage des données
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers, sauf dans les cas suivants :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Avec votre consentement explicite</li>
                                <li>Pour respecter une obligation légale</li>
                                <li>Avec nos prestataires de services (sous contrat de confidentialité)</li>
                                <li>En cas de fusion ou d&apos;acquisition</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Sécurité des données
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Chiffrement des données en transit et au repos</li>
                                <li>Accès restreint aux données personnelles</li>
                                <li>Surveillance continue de la sécurité</li>
                                <li>Sauvegardes régulières et sécurisées</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Vos droits
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Conformément au RGPD, vous avez les droits suivants :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Droit d&apos;accès à vos données</li>
                                <li>Droit de rectification</li>
                                <li>Droit à l&apos;effacement</li>
                                <li>Droit à la portabilité</li>
                                <li>Droit d&apos;opposition</li>
                                <li>Droit de limitation du traitement</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Cookies
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Nous utilisons des cookies pour améliorer votre expérience utilisateur. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Contact
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Pour toute question concernant cette politique de confidentialité, contactez-nous :
                            </p>
                            <p className="text-gray-600">
                                <strong>Email :</strong> <a href="mailto:pierre.forques@viacesi.fr" className="text-orange-600 hover:text-orange-700">pierre.forques@viacesi.fr</a>
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Modifications
                            </h2>
                            <p className="text-gray-600">
                                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
