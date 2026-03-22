import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MME Home | Making Mortgage Easy',
  description: 'Licensed wholesale mortgage broker in California. Purchase, refinance, HELOC, DSCR loans and more. NMLS# 1082653.',
  metadataBase: new URL('https://mmehome.com'),
  openGraph: {
    title: 'MME Home | Making Mortgage Easy',
    description: 'Home financing, done easier. Licensed mortgage broker serving California.',
    url: 'https://mmehome.com',
    siteName: 'MME Home',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MME Home | Making Mortgage Easy',
    description: 'Home financing, done easier.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
