import { getLocations } from "@/actions/populateTables";
import Header from "@/components/header";
import LocationsInitializer from "@/components/location-initializer";
import NextProgress from "@/components/next-progress";
import { Toast } from "@/components/toast-component";
import { getRequiredUser } from "@/lib/auth-session";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kinshasa Air Quality",
  keywords: ["Next.js", "Kinshasa Air Quality", "KINAQ", "WASARU WASH", "SaaS", "Web App", 'Air Quality Monitoring', 'DR Congo'],
  authors: [{ name: "Victor Kadiata", url: "https://kinaq.vercel.app" }],
  creator: "Victor Kadiata",
  description: "Air quality monitoring dashboard for Kinshasa. The Kinshasa Air Quality Project (KINAQ) is implemented by WASARU (led by KASEREKA ISEVULAMBIRE), in partnership with Professor Daniel WESTERVELT of Columbia University (USA), with financial support of the Energy Policy Institute at the University of Chicago (EPIC)",
  openGraph: {
    title: 'Kinshasa Air Quality | KINAQ',
    description: 'Download air quality data from KINAQ and learn about our mission to improve air quality in Kinshasa and DR Congo.',
    url: 'https://kinaq.wasaruwash.org',
    siteName: 'Kinshasa Air Quality',
    images: [
      {
        url: 'https://kinaq.wasaruwash.org/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KINAQ air quality dashboard and mission',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KINAQ',
    description: 'Learn how KINAQ is helping improve air quality in Kinshasa with data, sensors, and awareness.',
    images: ['https://kinaq.wasaruwash.org/og-image.jpg'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const messages = await getMessages();
  const locale = await getLocale();
  const locationsData = await getLocations();
  const user = await getRequiredUser();

  return (
    <html lang={locale} className="h-dvh" suppressHydrationWarning>
      <body className={inter.className}>
        <Toast />
        <NextIntlClientProvider messages={messages}>
          <main className="flex flex-col min-h-screen mx-auto">
            <Header user={user} />
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