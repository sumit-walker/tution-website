import "./globals.css";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientOnly } from "@/components/ClientOnly";

export const metadata = {
  title: "Tuition Classes - Modern Coaching",
  description:
    "Promotional website for a tuition teacher offering classes from 6th to 12th standard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-slate-50 text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-50"
      >
        <ThemeProvider>
          <MotionProvider>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
              <div className="pointer-events-none fixed inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.58),transparent_60%),radial-gradient(circle_at_bottom,_rgba(30,64,175,0.4),transparent_60%)] dark:block" />
              <div className="relative z-10 flex justify-center px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="w-full max-w-6xl overflow-x-hidden">
                  <ClientOnly>{children}</ClientOnly>
                </div>
              </div>
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

