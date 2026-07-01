import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "NotesOS — The Fastest Academic Notes Platform",
    template: "%s | NotesOS",
  },
  description:
    "Find, upload, and read academic notes instantly. The fastest, simplest, and most enjoyable platform for students to share knowledge.",
  keywords: [
    "notes",
    "academic",
    "study",
    "PDF",
    "university",
    "students",
    "education",
    "share notes",
  ],
  authors: [{ name: "NotesOS" }],
  openGraph: {
    title: "NotesOS — The Fastest Academic Notes Platform",
    description:
      "Find, upload, and read academic notes instantly.",
    type: "website",
    locale: "en_US",
    siteName: "NotesOS",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <div className="w-full relative">
          <div className="flex flex-col min-h-screen">
            <Providers>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
