import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from '@/components/AppShell';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linear Clone",
  description: "A Linear style issue tracker",
};

import { ViewFilterProvider } from "@/context/ViewFilterContext";
import { UserProvider } from "@/context/UserContext";
import { IssueSelectionProvider } from "@/context/IssueSelectionContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)] overflow-hidden`}
      >
        <ViewFilterProvider>
          <UserProvider>
            <IssueSelectionProvider>
              <AppShell>
                {children}
              </AppShell>
            </IssueSelectionProvider>
          </UserProvider>
        </ViewFilterProvider>
      </body>
    </html>
  );
}
