import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toast } from "@/components/toast-component"
import NextProgress from "@/components/next-progress"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kinshasa Air Quality",
  description: "Air quality monitoring dashboard for Kinshasa",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Toast />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <main className="flex flex-col min-h-screen">
              <Header />
              {children}
              <Analytics />
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
        <NextProgress />
      </body>
    </html>
  )
}