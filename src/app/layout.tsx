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
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Raleway:wght@400;700&family=Poppins:wght@400;700&family=Ubuntu:wght@400;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&family=Nunito:wght@400;700&family=Oswald:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script src="public/js/viewport.js" defer></script>
      </Head>
      <body
        className={nixie.className}
        style={{
          padding: "0",
          overflowX: "hidden",
          overflowY: "hidden",
          height: "100dvh",
        }}
      >
        <ToastProvider>
          <AuthProvider>
            <UserProvider>
              <CategoryProvider>
                <StickerProvider>
                  {children}
                  <DashMenu />
                </StickerProvider>
              </CategoryProvider>
            </UserProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
