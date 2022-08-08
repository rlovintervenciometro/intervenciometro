import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import ContentLoader, { Facebook } from "react-content-loader";
import { useSelector } from "react-redux";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import Header from "../../components/coursePage/Header";
import { db } from "../../../firebase";
import StudentsList from "../../components/coursePage/StudentsList";

export default function CoursePage() {
  const userInfo = useSelector(state => state.user.userInfo);
  const [courseInfo, setCourseInfo] = useState(null);
  const router = useRouter();
  const isMounted = useRef(false);
  const { courseId } = router.query;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userInfo != null) {
      const courseReference = doc(
        db,
        "organizations",
        userInfo?.organizationId,
        "courses",
        courseId,
      );

      const suscriber = onSnapshot(
        courseReference,
        res => {
          if (res.exists) {
            const object = res.data();
            object.id = res.id;
            if (isMounted.current) {
              setCourseInfo(object);
            }
          } else if (isMounted.current) {
            setCourseInfo("doesn't exist");
          }
        },
        err => {
          console.log("Err: ", err);
        },
      );

      return () => {
        suscriber();
      };
    }
  }, [userInfo]);

  if (courseInfo == null || userInfo == null) {
    return (
      <LoaderContainer>
        <ClipLoader size={80} />
      </LoaderContainer>
    );
  }

  if (courseInfo == "doesn't exist") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "120px",
        }}>
        <ImageContainer>
          <Image
            src={require("../../../public/images/courseDoesntExist.png")}
            layout="fill"
            objectFit="contain"
          />
        </ImageContainer>
        <Message>Lo sentimos, este curso no se encuentra disponible</Message>
      </div>
    );
  }

  return (
    <Container>
      <Header course={courseInfo} />
      <StudentsList course={courseInfo} />
    </Container>
  );
}

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  width: 100vw;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 400px;
  width: 600px;
`;

const Container = styled.main`
  padding: 25px 15%;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-top: 40px;
`;
