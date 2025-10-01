import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Conditions d\'utilisation',
    description: 'Conditions d\'utilisation de RevisIA - Règles et conditions d\'usage de notre plateforme.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Conditions d&apos;utilisation
                    </h1>

                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-6">
                            <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. Acceptation des conditions
                            </h2>
                            <p className="text-gray-600 mb-4">
                                En accédant et en utilisant RevisIA, vous acceptez d&apos;être lié par ces conditions d&apos;utilisation.
                                Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. Description du service
                            </h2>
                            <p className="text-gray-600 mb-4">
                                RevisIA est une plateforme qui utilise l&apos;intelligence artificielle pour générer automatiquement
                                des QCM (Questions à Choix Multiples) à partir de documents que vous uploadez. Notre service permet de :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Transformer des documents en questions de révision</li>
                                <li>Générer des QCM personnalisés</li>
                                <li>Suivre les performances d&apos;apprentissage</li>
                                <li>Optimiser les révisions</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Compte utilisateur
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Pour utiliser notre service, vous devez créer un compte. Vous vous engagez à :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Fournir des informations exactes et à jour</li>
                                <li>Maintenir la confidentialité de votre mot de passe</li>
                                <li>Être responsable de toutes les activités sur votre compte</li>
                                <li>Nous notifier immédiatement de toute utilisation non autorisée</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Utilisation acceptable
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Vous vous engagez à utiliser RevisIA de manière légale et éthique. Il est interdit de :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Uploadez du contenu illégal, offensant ou inapproprié</li>
                                <li>Violer les droits d&apos;auteur ou la propriété intellectuelle</li>
                                <li>Tenter de contourner les mesures de sécurité</li>
                                <li>Utiliser le service à des fins commerciales sans autorisation</li>
                                <li>Transmettre des virus ou codes malveillants</li>
                                <li>Harceler ou menacer d&apos;autres utilisateurs</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Contenu utilisateur
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Vous conservez tous les droits sur le contenu que vous uploadez. En utilisant notre service, vous nous accordez une licence limitée pour :
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                                <li>Traiter vos documents pour générer des QCM</li>
                                <li>Stocker vos données sur nos serveurs</li>
                                <li>Améliorer nos algorithmes d&apos;IA</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Propriété intellectuelle
                            </h2>
                            <p className="text-gray-600 mb-4">
                                RevisIA et son contenu sont protégés par les droits d&apos;auteur et autres droits de propriété intellectuelle.
                                Vous ne pouvez pas copier, modifier, distribuer ou créer des œuvres dérivées sans notre autorisation écrite.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Limitation de responsabilité
                            </h2>
                            <p className="text-gray-600 mb-4">
                                RevisIA est fourni &quot;en l&apos;état&quot;. Nous ne garantissons pas que le service sera ininterrompu ou exempt d&apos;erreurs.
                                Nous ne serons pas responsables des dommages indirects, consécutifs ou punitifs.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Suspension et résiliation
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions.
                                Vous pouvez résilier votre compte à tout moment en nous contactant.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. Modifications des conditions
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées sur cette page.
                                Votre utilisation continue du service constitue votre acceptation des nouvelles conditions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. Droit applicable
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Ces conditions sont régies par le droit français. Tout litige sera soumis à la juridiction des tribunaux français.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. Contact
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Pour toute question concernant ces conditions d&apos;utilisation, contactez-nous :
                            </p>
                            <p className="text-gray-600">
                                <strong>Email :</strong> <a href="mailto:pierre.forques@viacesi.fr" className="text-orange-600 hover:text-orange-700">pierre.forques@viacesi.fr</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
