import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/content";
import { Cursor } from "@/components/site/Cursor";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cafeshop.uz"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Speciality coffee roasted in-house every Tuesday, an espresso and filter bar, and a kitchen that bakes at six. Forty seats on Amir Temur Avenue, Tashkent.",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "Small-batch roastery and café in Tashkent. Espresso bar, hand-poured filter, pastry baked daily.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body>
        <Cursor />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
