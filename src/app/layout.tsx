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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-[#f5f5f5]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen text-zinc-900 flex flex-col bg-[#f5f5f5]">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col w-full relative">
            {children}
          </main>
          {/* We hide the footer on the home page using a route check in Footer or just keep it simple */}
        </Providers>
      </body>
    </html>
  );
}
