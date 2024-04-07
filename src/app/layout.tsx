import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";
import VideoContextProvider from "@/components/VideoContextProvider/VideoContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simple Video Player - Play local video files on the browser",
  description:
    "Simple Video Player lets you play your local video files via the browser. You can also add subtitle files to your video as you watch. Your videos will not be uploaded anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="UA-172486649-1" />
      <body className={inter.className}>
        <noscript>
          Simple Video Player lets you play your local video files via the
          browser. You can also add subtitle files to your video as you watch.
          Your videos will not be uploaded anywhere.
        </noscript>
        <VideoContextProvider>{children}</VideoContextProvider>
      </body>
    </html>
  );
}
