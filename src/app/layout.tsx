import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toast } from "@/components/toast-component"
import NextProgress from "@/components/next-progress"
import { Analytics } from "@vercel/analytics/react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { populateLocationsTable } from "@/actions/populateTables";

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

  const session = await auth?.api.getSession({
    headers: await headers(),
  });

  console.log({session})

  await populateLocationsTable();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Toast />
        <NextIntlClientProvider messages={messages}>
          <main className="flex flex-col min-h-screen">
            <Header session={session} />
            {children}
            <Analytics />
          </main>
        </NextIntlClientProvider>
        <NextProgress />
      </body>
    </html>
  )
}