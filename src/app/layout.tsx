import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import { AppShell } from '@/components/layout/AppShell'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'PDF Lovers Admin',
  description: 'Production-grade admin panel for pdflovers.app',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <link
            href="https://api.fontshare.com/v2/css?f[]=beVietnam-pro@300,400,401,500,600,700,800,900&f[]=literata@300,400,500,600,700,800,900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-bg-primary text-text-primary antialiased">
          <AppShell>{children}</AppShell>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#171a20',
                color: '#f1f3f8',
                border: '1px solid #303543',
                borderRadius: '6px',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
