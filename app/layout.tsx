import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A Blank Canvas",
  description: "Haeun's website",
  icons: {
    icon:[
      '/favicon/favicon.ico?v=1',
    ],
    apple:[
      '/favicon/apple-touch-icon.png?v=4',
    ],
    shortcut:[
      '/favicon/apple-touch-icon.png',
    ],
  },
  manifest: '/site.webmanifast'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qko1ckz.css" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body >{children}</body>
    </html>
  );
}
