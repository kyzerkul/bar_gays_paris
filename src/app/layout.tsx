import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Bars Gay Paris | Le Guide Complet des Établissements LGBT+ Parisiens',
  description: 'Découvrez la sélection complète des bars gay, LGBT+ et queer friendly de Paris. Filtrez par quartier, type d\'ambiance et trouvez les meilleures adresses pour sortir à Paris.',
  keywords: 'bar gay paris, établissement LGBT paris, bar lesbien paris, club gay paris, marais paris gay, sortir gay paris',
  icons: {
    icon: '/Favicon.png',
    apple: '/Favicon.png',
  },
  alternates: {
    canonical: 'https://bars-gay-paris.fr',
  },
  openGraph: {
    title: 'Bars Gay Paris | Le Guide Complet des Établissements LGBT+',
    description: 'Trouvez les meilleurs bars gay et LGBT+ de Paris avec notre guide interactif et complet. Filtrez par quartier, ambiance, et découvrez les incontournables de la scène parisienne.',
    url: 'https://bars-gay-paris.fr',
    siteName: 'Bars Gay Paris',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bars Gay Paris | Guide Complet des Établissements LGBT+',
    description: 'Guide interactif des bars gay, LGBT+ et queer de Paris. Filtrez par quartier, ambiance, et découvrez les meilleures adresses parisiennes.',
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
  metadataBase: new URL('https://bars-gay-paris.fr'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-bg-dark text-text-light font-sans">
        <header className="sticky top-0 z-50 w-full">
          {/* Nous créerons un composant Header ultérieurement */}
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="mt-auto">
          {/* Nous créerons un composant Footer ultérieurement */}
        </footer>
      </body>
    </html>
  )
}
