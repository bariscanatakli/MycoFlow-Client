import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/lib/content/Provider";
import { NotificationProvider } from "@/components/ui/GlobalNotification";

// ===== Fonts =====

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// ===== Metadata =====

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://mycoflow.io"
  ),
  title: {
    default: "MycoFlow | Bio-Inspired QoS for Modern Networks",
    template: "%s | MycoFlow",
  },
  description:
    "Harness the adaptive intelligence of mycelium networks for self-organizing, reflexive Quality of Service. Real-time optimization inspired by nature.",
  keywords: [
    "QoS",
    "Quality of Service",
    "network optimization",
    "bio-inspired",
    "mycelium",
    "adaptive routing",
    "reflexive systems",
    "network management",
  ],
  authors: [{ name: "MycoFlow Team" }],
  creator: "MycoFlow",
  publisher: "MycoFlow",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mycoflow.io",
    siteName: "MycoFlow",
    title: "MycoFlow | Bio-Inspired QoS for Modern Networks",
    description:
      "Harness the adaptive intelligence of mycelium networks for self-organizing, reflexive Quality of Service.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MycoFlow - Bio-Inspired Network QoS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MycoFlow | Bio-Inspired QoS",
    description:
      "Adaptive, self-organizing Quality of Service inspired by mycelium networks.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ===== Root Layout =====

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <NotificationProvider>
          <ContentProvider>
            {children}
          </ContentProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
