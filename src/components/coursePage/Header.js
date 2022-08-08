import React from "react";
import Image from "next/image";
import { IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import styled from "styled-components";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import getRandomValue from "../../utils/getRandomValue";

const images = [
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage2.jpg?alt=media&token=c26002cb-f859-49e0-9702-bcd69ec79853",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage3.jpg?alt=media&token=e26f0b42-51d8-4471-a5af-2ebfe8c40e9a",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage5.jpg?alt=media&token=745931b4-1be3-43f4-a96e-473cccc7fcf0",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage6.jpg?alt=media&token=26aa3422-5db3-4b5f-8b2d-4fe15a9b3a3f",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimage7.jpg?alt=media&token=950d2fd6-2b1c-4229-8445-4b9e14e1b57d",
  "https://firebasestorage.googleapis.com/v0/b/intervenciometro.appspot.com/o/courses%2Fimg_reachout%20(1).jpg?alt=media&token=2d0a08b6-90c3-428a-8ae4-e64c6288c381",
];

export default function CourseHeader({ course }) {
  const { name, code } = course;
  const router = useRouter();

  const getImage = () => {
    const random = getRandomValue(0, images.length);
    return images[random];
  };

  const goToBack = () => {
    router.push("/");
  };

  const getName = () => (name ? capitalize(name) : "");

  const getCode = () => code || "";

  return (
    <Container>
      <ImageContainer>
        <Header>
          <CustomButton onClick={goToBack}>
            <ArrowBackIcon style={{ color: "black" }} />
          </CustomButton>
          <CodeContainer>
            <Code>{getCode()}</Code>
          </CodeContainer>
        </Header>
        <Image src={getImage()} layout="fill" objectFit="cover" />
      </ImageContainer>
      <Footer>
        <Name>{getName()}</Name>
      </Footer>
    </Container>
  );
}

const Container = styled.header`
  background-color: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 130px;
`;

const Header = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 15px;
  left: 0px;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
`;

const CustomButton = styled(IconButton)`
  &&& {
    background-color: white;
    border: 1px solid black;
  }
`;

const CodeContainer = styled.div`
  border: 1px solid black;
  background-color: white;
  border-radius: 14px;
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
`;
const Code = styled.p`
  font-family: "Poppins", sans-serif;
  color: black;
  font-size: 0.8rem;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 70px;
  padding-left: 20px;
`;

const Name = styled.p`
  color: black;
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
`;
