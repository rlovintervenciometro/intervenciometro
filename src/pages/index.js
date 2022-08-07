import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RingLoader from "react-spinners/HashLoader";
import Backdrop from "@material-ui/core/Backdrop";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import CoursesList from "../components/home/CoursesList";
import { auth, db } from "../../firebase";
import colors from "../utils/colors";
import { setUserInfo } from "../context/reducers/userInfo";

export default function Home() {
  const userInfo = useSelector(state => state.user.userInfo);
  const user = auth.currentUser;
  const dispatch = useDispatch();
  const router = useRouter();

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

  if (userInfo == null) {
    return (
      <Backdrop
        open
        style={{ zIndex: 1000, backgroundColor: "rgba(0,0,0,0.8)" }}>
        <RingLoader color={colors.MAIN_COLOR} size={70} />
      </Backdrop>
    );
  }

  return <CoursesList />;
}
