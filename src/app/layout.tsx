import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// The one web font: the section bar, heading tabs, wordmark and ranking
// numbers (`font-display` in globals.css). Body text is plain Arial.
// Libre Franklin rather than Roboto Condensed: the condensed face is time.mk's
// own, and Franklin Gothic is the classic newspaper sans.
const franklin = Libre_Franklin({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-franklin",
  display: "swap",
});

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
    <html lang="sq" className={franklin.variable} suppressHydrationWarning>
      {/* No `antialiased`: default text rendering is the heavier, plainer one. */}
      <body>
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
