import type { Metadata } from "next";
import { Nixie_One } from "next/font/google";
import "../styles/global.css";
import ToastProvider from "@/context/toastContext";
import { AuthProvider } from "@/context/authContext";
import Header from "./components/header";
import { UserProvider } from "@/context/userContext";
import { CategoryProvider } from "@/context/categoryContext";

const nixie = Nixie_One({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Story Marker",
  description: "Para copiar stickers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nixie.className}>
        <ToastProvider>
          <AuthProvider>
            <UserProvider>
              <CategoryProvider>{children}</CategoryProvider>
            </UserProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
