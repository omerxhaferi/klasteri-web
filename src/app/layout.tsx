import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klasteri - Lajmet, me rrënjë e degë",
  description: "Agregatori i lajmeve shqip. Të gjitha lajmet nga burime të ndryshme, të grupuara sipas temës.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  itunes: {
    appId: "6759223617",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

const GA_MEASUREMENT_ID = "G-78771G5S06";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className="antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
