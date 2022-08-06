import React from "react";
import styled from "styled-components";
import { Button, IconButton } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import Image from "next/image";
import LoginInput from "../components/LoginInput";
import colors from "../utils/colors";
import forgotPasswordImage from "../../public/images/forgotPassword.png";

export default function ForgotPassword() {
  const router = useRouter();

  const goBack = () => {
    router.push("/login");
  };

  const onPressSendCode = () => {};

  return (
    <Container>
      <Header>
        <IconButton onClick={goBack}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
      </Header>
      <FormContainer>
        <Title>Reestablece tu contraseña</Title>
        <LoginInput placeholder="Correo" icon={<AlternateEmailIcon />} />
        <ButtonSendCodeContainer>
          <ButtonSendCode onClick={onPressSendCode}>
            <ButtonSendCodeText>
              Enviar código de recuperación
            </ButtonSendCodeText>
          </ButtonSendCode>
        </ButtonSendCodeContainer>
      </FormContainer>
      <AbsoluteImage>
        <ImageContainer>
          <Image src={forgotPasswordImage} layout="fill" objectFit="contain" />
        </ImageContainer>
      </AbsoluteImage>
      <BottomLeftCircle />
      <TopRightCircle />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  padding-left: 35px;
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.header`
  padding-top: 25px;
`;

const AbsoluteImage = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 100vh;
  min-width: 40vw;
`;

const FormContainer = styled.div`
  width: 35%;
`;

const Title = styled.p`
  font-size: 1.5rem;
  text-align: left;
  margin-bottom: 40px;
  margin-top: 75px;
  font-style: normal;
  font-weight: 600;
`;

const ButtonSendCodeContainer = styled.div``;

const ButtonSendCode = styled(Button)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    border-radius: 20px;
    padding-top: 14px;
    padding-bottom: 14px;
    margin-top: 25px;
    width: 100%;
  }
`;

const ButtonSendCodeText = styled.p`
  color: white;
  text-transform: none;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
`;

const BottomLeftCircle = styled.div`
  background-color: ${colors.MAIN_COLOR};
  height: 550px;
  width: 650px;
  position: absolute;
  bottom: -300px;
  border-radius: 100%;
  left: -120px;
`;

const TopRightCircle = styled.div`
  background-color: ${colors.MAIN_COLOR};
  height: 550px;
  width: 650px;
  position: absolute;
  top: -300px;
  border-radius: 100%;
  right: -260px;
`;
