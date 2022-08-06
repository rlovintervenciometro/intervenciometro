import React from "react";
import { useRouter } from "next/router";
import Header from "./Header";

export default function Layout({ children }) {
  const router = useRouter();
  const publicPaths = ["/login", "/forgot-password", "/signup"];
  const path = router?.asPath?.split("?")[0];

  return (
    <>
      {!publicPaths.includes(path) && <Header />}
      <main>{children}</main>
    </>
  );
}
