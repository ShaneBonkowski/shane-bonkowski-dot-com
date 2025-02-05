import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieAgreement from "@/components/CookieAgreement";

export const metadata = {
  metadataBase: new URL("https://shanebonkowski.com"),
  title: "Shanes Games",
  description: "Games, art, writing, and more by Shane Bonkowski.",
  openGraph: {
    title: "Shanes Games",
    description: "Games, art, writing, and more by Shane Bonkowski.",
    url: "https://shanebonkowski.com",
    images: [
      {
        url: "/webps/mars-circle.webp",
        alt: "Shanes Games Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <CookieAgreement />
        <Footer />
      </body>
    </html>
  );
}
