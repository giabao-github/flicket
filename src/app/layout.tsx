import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";


const lexend = Lexend({
  subsets: ["latin", "vietnamese"]
});

export const metadata: Metadata = {
  title: "Flicket", 
  description: "Optimized video sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl='/'>
      <html lang='en'>
        <body
          className={`${lexend.className}`}
        >
          <TRPCProvider>
            <Toaster />
            {children}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
