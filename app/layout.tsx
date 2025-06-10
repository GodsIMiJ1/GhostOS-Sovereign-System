import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '🔥 GhostOS - Sovereign Interface',
  description: 'The Empire\'s Digital Backbone - Visual Control System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
