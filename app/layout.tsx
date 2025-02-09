import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieAgreement from "@/components/layout/CookieAgreement";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <meta property="og:image" content="/webps/mars-circle.webp" />
        <meta property="og:image:alt" content="Shanes Games Logo" />
        <meta property="og:type" content="website" />
      </Head>
      <body className="flex flex-col min-h-full">
        <Header />
        <main className="flex-grow">{children}</main>
        <CookieAgreement />
        <Footer />
      </body>
    </html>
  );
}
