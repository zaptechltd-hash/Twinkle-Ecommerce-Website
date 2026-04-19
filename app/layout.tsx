import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { store } from "./store/index";
import { Providers } from "./Providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twinkle Official",
  description: "Twinkle Official is a premium nightwear brand designed for comfort, elegance, and quiet luxury. Crafted with soft, breathable fabrics, each piece is made to bring ease and beauty to your everyday moments at home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <Providers>{children}</Providers></body>
    </html>
  );
}
// app/layout.tsx
// app/layout.tsx
// import type { Metadata } from "next";
// import Providers from "./Providers";

// export const metadata: Metadata = {
//   title: "Twinkle Official",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }