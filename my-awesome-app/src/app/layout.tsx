import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { AppLayout } from "@/components/app-shell/app-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Awesome Notes - Productivity Hub",
  description: "Your all-in-one productivity hub for notes, tasks, projects, and knowledge management",
  keywords: ["notes", "tasks", "productivity", "project management", "knowledge base"],
  authors: [{ name: "My Awesome Notes" }],
  openGraph: {
    title: "My Awesome Notes - Productivity Hub",
    description: "Your all-in-one productivity hub for notes, tasks, projects, and knowledge management",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
