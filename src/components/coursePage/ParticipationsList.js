import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import ParticipationItem from "./ParticipationItem";

export default function ParticipationsList({ course, view }) {
  const userInfo = useSelector(state => state.user.userInfo);
  const [participations, setParticipations] = useState(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const participationsReference = collection(
      db,
      "organizations",
      userInfo?.organizationId,
      "courses",
      course?.id,
      "participations",
    );

    const q = query(participationsReference, orderBy("createAt", "desc"));

    const suscriber = onSnapshot(
      q,
      snapshot => {
        if (!snapshot.empty) {
          const tempArray = [];
          snapshot.forEach(doc => {
            const object = doc.data();
            object.id = doc.id;
            tempArray.push(object);
          });
          if (isMounted.current) {
            setParticipations(tempArray);
          }
        } else if (isMounted.current) {
          setParticipations([]);
        }
      },
      err => {
        console.log("Err: ", err);
      },
    );

    return () => {
      suscriber();
    };
  }, []);

  return (
    <Container view={view}>
      {participations == null ? (
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <ClipLoader size={40} />
        </div>
      ) : participations?.length == 0 ? (
        <div>
          <ImageContainer>
            <Image
              src={require("../../../public/images/notFound.png")}
              layout="fill"
              objectFit="contain"
            />
          </ImageContainer>
          <Message>No hay alumnos registrados en este curso</Message>
        </div>
      ) : (
        participations?.map((item, index) => (
          <ParticipationItem key={`${item.id}_${index}`} participation={item} />
        ))
      )}
    </Container>
  );
}

const Container = styled.div`
  display: ${props => (props.view == "students" ? "none" : "block")};
  margin-top: 20px;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 150px;
  width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 100px;
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-top: 50px;
  text-align: center;
`;
