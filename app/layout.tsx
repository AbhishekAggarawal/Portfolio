import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {JetBrains_Mono} from "next/font/google"
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrainsMono",
  weight: ["100", "200" , "300" , "400" , "500" , "600" , "700" , "800"],
  // display: 'swap',
});

export const metadata: Metadata = {
  title: "Abhishek Aggarwal",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} antialiased`}>
        <Header />
        <PageTransition>

        {children}
        
        </PageTransition>
        
      </body>
    </html>
  );
}
