// NOTE: to self, cannot make this "use client", since it will break metadata export.
// Do NOT use "use client"

import "@/src/styles/globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CookieAgreement from "@/src/components/CookieAgreement";
import Script from "next/script";
import Head from "next/head";

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
    // Add the dark class to the html so we can toggle light and dark mode
    <html lang="en" className="dark">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      {/* Add components to the body of the website */}
      <body className="flex flex-col min-h-screen" id="website-body">
        {/* Add Google Analytics  */}
        <Script
          strategy="beforeInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-ZM9N1BE5ET`}
        />
        <Script
          id="google-analytics"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-ZM9N1BE5ET', {
                    page_path: window.location.pathname,
                  });
                `,
          }}
        />
        <Header />
        <main className="flex-grow relative" id="website-main-content">
          {children}
        </main>
        <CookieAgreement />
        <Footer />
      </body>
    </html>
  );
}
