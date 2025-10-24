import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HCGA 3S-GSM Dashboard",
  description: "Sistem Manajemen Sumber Daya Manusia - Human Capital Global Analytics",
  keywords: ["HCGA", "HR Dashboard", "Human Capital", "Management System", "3S-GSM"],
  authors: [{ name: "Yan Firdaus" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "HCGA 3S-GSM Dashboard",
    description: "Sistem Manajemen Sumber Daya Manusia",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
