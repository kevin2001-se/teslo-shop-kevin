import type { Metadata } from "next";
import "./globals.css";
import { geistSans } from "@/config/fonts";
import { Provider } from "@/components";


export const metadata: Metadata = {
  title: {
    template: "%s - Teslo | Shop",
    default: 'Home - Teslo | Shop'
  },
  description: "Una tienda virtual de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
