"use client";

import "../styles/global.css";
import "../styles/fonts.css";

import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "@/styles/customTheme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={customTheme}>{children} </ChakraProvider>
      </body>
    </html>
  );
}

