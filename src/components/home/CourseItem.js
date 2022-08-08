import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";
import { capitalize } from "lodash";
import { ClipLoader } from "react-spinners";
import { FaUserGraduate } from "react-icons/fa";
import Image from "next/image";
import colors from "../../utils/colors";
import getRandomValue from "../../utils/getRandomValue";

const images = [
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage2.jpg?alt=media&token=c26002cb-f859-49e0-9702-bcd69ec79853",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage3.jpg?alt=media&token=e26f0b42-51d8-4471-a5af-2ebfe8c40e9a",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage5.jpg?alt=media&token=745931b4-1be3-43f4-a96e-473cccc7fcf0",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage6.jpg?alt=media&token=26aa3422-5db3-4b5f-8b2d-4fe15a9b3a3f",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage7.jpg?alt=media&token=950d2fd6-2b1c-4229-8445-4b9e14e1b57d",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimg_reachout%20(1).jpg?alt=media&token=2d0a08b6-90c3-428a-8ae4-e64c6288c381",
];

export default function CourseItem({ course }) {
  const router = useRouter();
  const [loadedImage, setLoadedImage] = useState(false);

  const navigateToCourseDetails = () => {
    /* router.push(`/course/${course?.id}`); */
  };

  const getQuantity = () => {
    if (course?.studentsQuantity != null) {
      return course?.studentsQuantity;
    }
    return 0;
  };

  const getImage = () => {
    const random = getRandomValue(0, images.length);
    return images[random];
  };

  return (
    <Link href={`/course/${course.id}`} passHref scroll={false}>
      <Container onClick={navigateToCourseDetails}>
        <ImageContainer>
          <Image
            onLoadingComplete={() => setLoadedImage(true)}
            src={getImage()}
            layout="fill"
            objectFit="cover"
          />
          {!loadedImage && (
            <LoaderContainer>
              <ClipLoader color={colors?.MAIN_COLOR} />
            </LoaderContainer>
          )}
        </ImageContainer>
        <Name>{capitalize(course?.name)}</Name>
        <Footer>
          <Code>{course?.code}</Code>
          <StudentQuantity>
            <FaUserGraduate size={14} />
            <Quantity>{getQuantity()} alumnos</Quantity>
          </StudentQuantity>
        </Footer>
      </Container>
    </Link>
  );
}

const Container = styled.a`
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
  position: relative;
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

const LoaderContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #c1c1c1;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  z-index: 100;
`;

const Quantity = styled.p`
  font-size: 0.7rem;
  color: black;
  font-weight: 500;
  margin-left: 10px;
  padding-top: 2px;
`;
