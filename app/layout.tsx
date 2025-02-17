// NOTE: to self, cannot make this "use client", since it will break metadata export.
// Do NOT use "use client"

import "@/src/styles/globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CookieAgreement from "@/src/components/CookieAgreement";
import Script from "next/script";

// NOTE: Need to keep metadata, since the <meta> tags are not supported with app router
export const metadata = {
  title: "Shanes Games",
  description: "Games, art, writing, and more by Shane Bonkowski.",
  openGraph: {
    title: "Shanes Games",
    description: "Games, art, writing, and more by Shane Bonkowski.",
    url: "https://shanebonkowski.com",
    images: [
      {
        // Open graph needs absolute url!
        url: "https://shanebonkowski.com/webps/mars-logo-large.webp",
        alt: "Shanes Games Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ShaneBonkowski",
    title: "Shanes Games",
    description: "Games, art, writing, and more by Shane Bonkowski.",
    image: `https://shanebonkowski.com/webps/mars-logo-large.webp`,
    imageAlt: "Shanes Games Logo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-full">
        <Header />
        <main className="flex-grow">{children}</main>
        <CookieAgreement />
        <Footer />
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
