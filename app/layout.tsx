import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataCamp Donates x FOROZ — Scholarship Application",
  description:
    "Apply for a free DataCamp Donates scholarship through FOROZ and gain access to 440+ data science courses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
