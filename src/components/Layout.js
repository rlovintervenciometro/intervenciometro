import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import Header from "./Header";
import NewCourseModal from "./NewCourseModal";
import { db, auth } from "../../firebase";
import { setUserInfo } from "../context/reducers/userInfo";

export default function Layout({ children }) {
  const userInfo = useSelector(state => state.user.userInfo);
  const user = auth.currentUser;
  const dispatch = useDispatch();
  const router = useRouter();
  const publicPaths = ["/login", "/forgot-password", "/signup"];
  const otherPaths = ["/organizationStepper"];
  const paths = [...publicPaths, ...otherPaths];
  const path = router?.asPath?.split("?")[0];

  useEffect(() => {
    if (user != null) {
      const userDoc = doc(db, "users", user?.uid);
      getDoc(userDoc)
        .then(res => {
          if (!res.exists()) {
            router.push("/organizationStepper");
          } else {
            const object = res.data();
            object.id = res.id;
            dispatch(
              setUserInfo({
                userInfo: object,
              }),
            );
          }
        })
        .catch(err => {
          console.log("Err: ", err);
        });
    }
  }, []);

  return (
    <>
      {!paths.includes(path) && <Header />}
      <main>{children}</main>
      {!paths.includes(path) && <NewCourseModal />}
    </>
  );
}
