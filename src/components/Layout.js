import React from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import NewCourseModal from "./NewCourseModal";

export default function Layout({ children }) {
  const router = useRouter();
  const publicPaths = ["/login", "/forgot-password", "/signup"];
  const otherPaths = ["/organizationStepper"];
  const paths = [...publicPaths, ...otherPaths];
  const path = router?.asPath?.split("?")[0];

  return (
    <>
      {!paths.includes(path) && <Header />}
      <main>{children}</main>
      {!paths.includes(path) && <NewCourseModal />}
    </>
  );
}
