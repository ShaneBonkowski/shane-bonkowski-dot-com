"use client";

import "@/src/styles/globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CookieAgreement from "@/src/components/CookieAgreement";
import Head from "next/head";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isGamesPath = pathname.startsWith("/games");

  return (
    <html lang="en">
      <Head>
        <title>Shanes Games</title>
        <meta
          name="description"
          content="Games, art, writing, and more by Shane Bonkowski."
        />
        <meta property="og:title" content="Shanes Games" />
        <meta
          property="og:description"
          content="Games, art, writing, and more by Shane Bonkowski."
        />
        <meta property="og:url" content="https://shanebonkowski.com" />
        <meta property="og:image" content="/webps/mars-logo-large.webp" />
        <meta property="og:image:alt" content="Shanes Games Logo" />
        <meta property="og:type" content="website" />
      </Head>
      <body className="flex flex-col min-h-full">
        <Header />
        <main className="flex-grow">{children}</main>
        {!isGamesPath && <CookieAgreement />}
        {!isGamesPath && <Footer />}
        {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
