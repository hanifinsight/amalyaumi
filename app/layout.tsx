import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amal Yaumi — Teman Ibadah Harian",
  description: "Catat, jaga, dan tingkatkan amal baik setiap hari."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
