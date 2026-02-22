import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.scss";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Outbound Travelers - Training Platform",
  description: "Professional travel training platform for sales teams. Learn about destinations through structured video courses.",
  keywords: "travel training, sales training, destination courses, Outbound Travelers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
