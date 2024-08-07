import type { Metadata } from "next";
import { Nixie_One } from "next/font/google";
import "../styles/global.css";
import ToastProvider from "@/context/toastContext";
import { AuthProvider } from "@/context/authContext";
import Header from "./components/header";
import { UserProvider } from "@/context/userContext";
import { CategoryProvider } from "@/context/categoryContext";
import { StickerProvider } from "@/context/stickerContext";
import DashMenu from "./dashboard/components/dashMenu";
import { ThemeProvider } from "@chakra-ui/react";
import Head from "next/head";

const nixie = Nixie_One({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Story Maker",
  description: "Para copiar stickers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      style={{
        height: "-webkit-fill-available",
      }}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="public/js/viewport.js" defer></script>
      </Head>
      <body
        className={nixie.className}
        style={{
          padding: "0",
          overflowX: "hidden",
          overflowY: "hidden",
          height: "-webkit-fill-available",
        }}
      >
        <ToastProvider>
          <AuthProvider>
            <UserProvider>
              <CategoryProvider>
                <StickerProvider>{children}</StickerProvider>
              </CategoryProvider>
            </UserProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
