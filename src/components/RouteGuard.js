import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import colors from "../utils/colors";
import { auth } from "../../firebase";

export { RouteGuard };

function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(true);
  const [login, setLogin] = useState(null);

  const authCheck = url => {
    // redirect to login page if accesing a private page and not logged in
    const publicPaths = ["/login", "/forgot-password", "/signup"];
    const path = url.split("?")[0];

    if (login && publicPaths.includes(path)) {
      setAuthorized(true);
      router.push("/");
      return;
    }

    /* if (login) {
      console.log("autch check: ", login);
      router.push({
        pathname: "/",
      });
      setAuthorized(true);
    } */

    if (!login && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/login",
      });
    } else {
      setAuthorized(true);
    }
  };

  useEffect(() => {
    const suscriber = onAuthStateChanged(auth, user => {
      if (user) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    });
    return () => {
      suscriber();
    };
  }, []);

  useEffect(() => {
    if (login != null) {
      authCheck(router.asPath);
      const hideContent = () => setAuthorized(false);

      router.events.on("routeChangeStart", hideContent);

      router.events.on("routeChangeComplete", authCheck);

      return () => {
        router.events.off("routeChangeStart", hideContent);
        router.events.off("routeChangeComplete", authCheck);
      };
    }
  }, [login]);

  if (login == null) {
    return (
      <Container>
        <ClipLoader color={colors?.MAIN_COLOR} size={60} />
      </Container>
    );
  }

  return authorized && children;
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
