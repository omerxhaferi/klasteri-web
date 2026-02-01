import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klasteri - Lajmet në një vend",
  description: "Agregatori i lajmeve shqip. Të gjitha lajmet nga burime të ndryshme, të grupuara sipas temës.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <body className="antialiased">
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
