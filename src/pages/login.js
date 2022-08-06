import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";
import Image from "next/image";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import loginImage from "../../public/images/login.png";
import logoImage from "../../public/images/logo.png";
import LoginInput from "../components/LoginInput";
import colors from "../utils/colors";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onClickForgotPassword = () => {
    router.push("/forgot-password");
  };

  const onClickSignUp = () => {
    router.push("/signup");
  };

  const signin = () => {};

  return (
    <Container>
      {/*  <LeftContainer>
        <ImageContainer>
          <Image src={loginImage} layout="responsive" objectFit="contain" />
        </ImageContainer>
      </LeftContainer> */}
      <RightContainer>
        <LogoContainerHeader>
          <LogoContainer>
            <Image src={logoImage} layout="fill" objectFit="contain" />
          </LogoContainer>
        </LogoContainerHeader>
        <Title>Inicia sesión</Title>
        <LoginInput placeholder="Correo" icon={<AlternateEmailIcon />} />
        <ForgotYourPasswordContainer>
          <Button onClick={onClickForgotPassword}>
            <ForgotYourPasswordText>¿La olvidaste?</ForgotYourPasswordText>
          </Button>
        </ForgotYourPasswordContainer>
        <LoginInput
          placeholder="Contraseña"
          type="password"
          icon={<VisibilityIcon />}
        />
        <ButtonSignInContainer>
          <ButtonSignin onClick={signin}>
            <SigninText>Ingresar</SigninText>
          </ButtonSignin>
        </ButtonSignInContainer>
        <DontHaveAccountContainer>
          <DontHaveAccountAuxText>
            ¿No tienes una cuenta?
          </DontHaveAccountAuxText>
          <DontHaveAccountButton onClick={onClickSignUp}>
            Regístrate
          </DontHaveAccountButton>
        </DontHaveAccountContainer>
      </RightContainer>
    </Container>
  );
}

const Container = styled.main`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media ${props => props.theme.breakpoints.xxl} {
  }
`;

const LeftContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  flex: 0.4;
  background-color: ${colors.MAIN_COLOR};
`;

const ImageContainer = styled.div`
  position: relative;
  padding-right: 40px;
`;

const RightContainer = styled.div`
  height: 100vh;
  padding-top: 120px;
  width: 65%;
  max-width: 500px;
`;

const LogoContainerHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
`;

const LogoContainer = styled.div`
  position: relative;
  height: 130px;
  width: 130px;
`;

const Title = styled.h4`
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 15px;
  font-style: normal;
  font-weight: 600;
`;

const ForgotYourPasswordContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
  margin-bottom: 5px;
`;

const ForgotYourPasswordText = styled.p`
  text-transform: none;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ButtonSignInContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const ButtonSignin = styled(Button)`
  &&& {
    background-color: ${colors.MAIN_COLOR};
    border-radius: 20px;
    padding-top: 14px;
    padding-bottom: 14px;
    width: 90%;
  }
`;

const SigninText = styled.p`
  color: white;
  text-transform: none;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
`;

const DontHaveAccountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const DontHaveAccountAuxText = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
`;

const DontHaveAccountButton = styled.p`
  color: ${colors.MAIN_COLOR};
  font-weight: 500;
  margin-left: 4px;
  font-size: 0.9rem;
  cursor: pointer;
`;
