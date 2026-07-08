import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traxium · Compliance Agrologística",
  description:
    "Plataforma SaaS de rastreabilidade e compliance GMP+ FSA e EUDR para transportadoras, tradings e cooperativas do agronegócio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // Extensões de browser (ex.: garimpo-ext) injetam atributos em <html> antes
      // do React hidratar. Suprime o warning de mismatch só nesse nível.
      suppressHydrationWarning
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
