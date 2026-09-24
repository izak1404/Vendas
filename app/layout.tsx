import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ann Café",
  description: "Sistema de PDV e Estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* Adicionamos o Toaster aqui, no topo da aplicação */}
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}