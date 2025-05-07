import { getLocations } from "@/actions/populateTables";
import Header from "@/components/header";
import LocationsInitializer from "@/components/location-initializer";
import NextProgress from "@/components/next-progress";
import { Toast } from "@/components/toast-component";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import "./globals.css";

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
  const locationsData = await getLocations();

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body className={inter.className}>
        <Toast />
        <NextIntlClientProvider messages={messages}>
          <main className="flex flex-col min-h-screen">
            <Header />
            <LocationsInitializer locationsData={locationsData}>
              {children}
            </LocationsInitializer>
            <NextProgress />
            <Analytics />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}