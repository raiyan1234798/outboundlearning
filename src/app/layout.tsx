import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.scss";
import { AuthProvider } from "@/contexts/AuthContext";

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
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
