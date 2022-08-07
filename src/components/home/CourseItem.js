import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import { FaUserGraduate } from "react-icons/fa";

const images = [];

export default function CourseItem({ course }) {
  const navigateToCourseDetails = () => {};

  const getQuantity = () => {
    if (course?.studentsQuantity != null) {
      return course?.studentsQuantity;
    }
    return 0;
  };

  return (
    <Container onClick={navigateToCourseDetails}>
      <ImageContainer />
      <Name>{capitalize(course?.name)}</Name>
      <Footer>
        <Code>{course?.code}</Code>
        <StudentQuantity>
          <FaUserGraduate size={14} />
          <Quantity>{getQuantity()} alumnos</Quantity>
        </StudentQuantity>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  border: 1px solid #c1c1c1;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;

  :hover {
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
  }
`;

const ImageContainer = styled.div`
  background-color: red;
  width: 100%;
  height: 150px;
`;

const Name = styled.p`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: "black";
  font-size: 1rem;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 15px;
`;
const Footer = styled.footer`
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  padding-top: 5px;
`;
const Code = styled.p`
  font-size: 0.9rem;
  color: grey;
`;
const StudentQuantity = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid black;
  padding: 5px 15px;
  border-radius: 16px;
`;
const Quantity = styled.p`
  font-size: 0.7rem;
  color: black;
  font-weight: 500;
  margin-left: 10px;
  padding-top: 2px;
`;
