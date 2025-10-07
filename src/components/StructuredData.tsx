import Script from 'next/script'

interface StructuredDataProps {
    type: 'website' | 'organization' | 'product' | 'article'
    data?: Record<string, unknown>
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    const getStructuredData = () => {
        const baseData = {
            '@context': 'https://schema.org',
            '@type': type === 'website' ? 'WebSite' : type === 'organization' ? 'Organization' : type === 'product' ? 'Product' : 'Article',
        }

        switch (type) {
            case 'website':
                return {
                    ...baseData,
                    name: 'RevisIA',
                    description: 'Générateur de QCM automatique utilisant l\'IA pour créer des quiz personnalisés',
                    url: 'https://revisia.app',
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: 'https://revisia.app/search?q={search_term_string}',
                        'query-input': 'required name=search_term_string'
                    }
                }

            case 'organization':
                return {
                    ...baseData,
                    name: 'RevisIA',
                    description: 'Générateur de QCM automatique utilisant l\'IA pour créer des quiz personnalisés',
                    url: 'https://revisia.app',
                    logo: 'https://revisia-app.fr/png/logo.png',
                    contactPoint: {
                        '@type': 'ContactPoint',
                        contactType: 'customer service',
                        email: 'contact@revisia.app'
                    },
                    sameAs: [
                        'https://twitter.com/revisia_app',
                        'https://linkedin.com/company/revisia'
                    ]
                }

            case 'product':
                return {
                    ...baseData,
                    name: 'RevisIA - Générateur de QCM par IA',
                    description: 'Transformez vos documents en QCM avec l\'IA',
                    brand: {
                        '@type': 'Brand',
                        name: 'RevisIA'
                    },
                    offers: {
                        '@type': 'Offer',
                        price: '0',
                        priceCurrency: 'EUR',
                        availability: 'https://schema.org/InStock',
                        url: 'https://revisia.app/pricing'
                    },
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: '4.8',
                        reviewCount: '150'
                    }
                }

            case 'article':
                return {
                    ...baseData,
                    headline: data?.title || 'RevisIA - Guide de génération de QCM',
                    description: data?.description || 'Découvrez comment créer des QCM automatiquement avec l\'IA',
                    author: {
                        '@type': 'Organization',
                        name: 'RevisIA Team'
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'RevisIA',
                        logo: {
                            '@type': 'ImageObject',
                            url: 'https://revisia-app.fr/png/logo.png'
                        }
                    },
                    datePublished: data?.datePublished || new Date().toISOString(),
                    dateModified: data?.dateModified || new Date().toISOString()
                }

            default:
                return baseData
        }
    }

    return (
        <Script
            id={`structured-data-${type}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(getStructuredData())
            }}
        />
    )
}
