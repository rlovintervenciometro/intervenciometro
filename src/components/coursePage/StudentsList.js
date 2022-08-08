import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import Image from "next/image";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import StudentItem from "./StudentItem";

export default function StudentsList({ course }) {
  const userInfo = useSelector(state => state.user.userInfo);
  const [students, setStudents] = useState(null);
  const isMounted = useRef(false);
  const { studentsQuantity } = course;

  console.log("students: ", students);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const studentsReference = collection(
      db,
      "organizations",
      userInfo?.organizationId,
      "courses",
      course?.id,
      "students",
    );

    const q = query(studentsReference, orderBy("name", "asc"));

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
            setStudents(tempArray);
          }
        } else if (isMounted.current) {
          setStudents([]);
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

  const getQuantity = () => {
    if (studentsQuantity != null) {
      if (studentsQuantity != 1) {
        return `${studentsQuantity} alumnos`;
      }
      return "1 alumno";
    }
    return "0 alumnos";
  };

  return (
    <Container>
      <QuantityContainer>
        <Quantity>{getQuantity()}</Quantity>
        <Line />
      </QuantityContainer>
      {students == null ? (
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
      ) : students?.length == 0 ? (
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
        students.map((item, index) => (
          <StudentItem key={`${item.id}_${index}`} student={item} type="list" />
        ))
      )}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 20px;
`;

const QuantityContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const Quantity = styled.p`
  font-weight: 600;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
`;

const Line = styled.div`
  flex: 1;
  height: 3px;
  margin-left: 10px;

  background-color: #c1c1c1;
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
