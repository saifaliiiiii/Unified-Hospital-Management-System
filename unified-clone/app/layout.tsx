import type { Metadata } from 'next'
import '@/styles/globals.css'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Unified Hospital Management Portal',
  description: 'Connecting Punjab with Quality Healthcare Services',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
