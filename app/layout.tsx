// NOTE: to self, cannot make this "use client", since it will break metadata export.
// Do NOT use "use client"

import "@/src/styles/globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CookieAgreement from "@/src/components/CookieAgreement";

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
      <body className="flex flex-col min-h-full" id="website-body">
        <Header />
        <main className="flex-grow" id="website-main-content">
          {children}
        </main>
        <CookieAgreement />
        <Footer />
      </body>
    </html>
  );
}
